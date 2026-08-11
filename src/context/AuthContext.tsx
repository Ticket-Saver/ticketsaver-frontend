import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import supabase from '../components/supabaseClient'

export interface AuthUser {
  id: string
  firstName: string
  lastName: string | null
  email: string
  phone: string | null
  emailVerified: boolean
  phoneVerified: boolean
  pendingPhone: string | null
  /** true para usuarios migrados con contraseña temporal; el gate fuerza el cambio. */
  mustChangePassword: boolean
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

const toAuthUser = (u: User): AuthUser => ({
  id: u.id,
  firstName: (u.user_metadata?.first_name as string | undefined) ?? u.email ?? 'Customer',
  lastName: (u.user_metadata?.last_name as string | undefined) ?? null,
  email: u.email ?? '',
  phone: u.phone ?? null,
  emailVerified: Boolean(u.email_confirmed_at),
  phoneVerified: Boolean(u.phone_confirmed_at),
  pendingPhone: (u.user_metadata?.pending_phone as string | undefined) ?? null,
  mustChangePassword: u.user_metadata?.must_change_password === true
})

export interface RegisterInput {
  firstName: string
  lastName?: string
  email: string
  phone: string
  phoneCountryCode?: string
  password: string
  passwordConfirmation: string
}

interface AuthContextValue {
  user: AuthUser | null
  status: AuthStatus
  register: (input: RegisterInput) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  /** OAuth con Google/Apple (redirect). El email viene verificado por el proveedor; el teléfono se verifica después vía el gate. */
  loginWithProvider: (provider: 'google' | 'apple') => Promise<void>
  logout: () => Promise<void>
  verifyEmail: (email: string, code: string) => Promise<void>
  verifyPhone: (phone: string, code: string) => Promise<void>
  /** channel 'email' reenvía el código de signup; 'sms' reintenta el alta de teléfono (dispara el Send SMS Hook de nuevo). */
  resendOtp: (identifier: string, channel: 'email' | 'sms') => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (password: string, passwordConfirmation: string) => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const requireSupabase = () => {
  if (!supabase)
    throw new Error(
      'Supabase no está configurado (faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).'
    )
  return supabase
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  const applySession = useCallback((session: Session | null) => {
    if (session?.user) {
      setUser(toAuthUser(session.user))
      setStatus('authenticated')
    } else {
      setUser(null)
      setStatus('unauthenticated')
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setStatus('unauthenticated')
      return
    }
    supabase.auth.getSession().then(({ data }) => applySession(data.session))
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session)
    })
    return () => subscription.subscription.unsubscribe()
  }, [applySession])

  useEffect(() => {
    const onForcedLogout = () => applySession(null)
    window.addEventListener('customer-auth:logout', onForcedLogout)
    return () => window.removeEventListener('customer-auth:logout', onForcedLogout)
  }, [applySession])

  const register = useCallback(async (input: RegisterInput) => {
    const { data, error } = await requireSupabase().auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          first_name: input.firstName,
          last_name: input.lastName ?? null,
          // Guardamos el teléfono pendiente en metadata: recién se asocia a la
          // cuenta (y dispara su propio OTP) una vez verificado el email.
          pending_phone: input.phone
        }
      }
    })
    if (error) throw error
    // Con confirmación de email activada, Supabase NO devuelve error si el email ya
    // existe (protección anti-enumeración): retorna un user obfuscado con identities
    // vacío. Sin este chequeo el registro parecía exitoso con un email ya usado.
    if (data.user && (data.user.identities?.length ?? 0) === 0) {
      throw new Error('That email is already registered. Try logging in instead.')
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await requireSupabase().auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])

  const loginWithProvider = useCallback(async (provider: 'google' | 'apple') => {
    // Redirect flow (web). Al volver, onAuthStateChange deja la sesión; el gate
    // de Router manda a /verify-phone si el teléfono aún no está confirmado.
    const { error } = await requireSupabase().auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/` }
    })
    if (error) throw error
  }, [])

  const logout = useCallback(async () => {
    await requireSupabase().auth.signOut()
  }, [])

  const verifyEmail = useCallback(async (email: string, code: string) => {
    const { error } = await requireSupabase().auth.verifyOtp({ email, token: code, type: 'signup' })
    if (error) throw error
  }, [])

  /** Asocia el teléfono a la cuenta ya autenticada por email; Supabase dispara el SMS OTP (via Send SMS Hook -> SNS). */
  const sendPhoneOtp = useCallback(async (phone: string) => {
    const { error } = await requireSupabase().auth.updateUser({ phone })
    if (error) throw error
  }, [])

  const verifyPhone = useCallback(async (phone: string, code: string) => {
    const { error } = await requireSupabase().auth.verifyOtp({
      phone,
      token: code,
      type: 'phone_change'
    })
    if (error) throw error
  }, [])

  const resendOtp = useCallback(
    async (identifier: string, channel: 'email' | 'sms') => {
      if (channel === 'sms') {
        await sendPhoneOtp(identifier)
        return
      }
      const { error } = await requireSupabase().auth.resend({ type: 'signup', email: identifier })
      if (error) throw error
    },
    [sendPhoneOtp]
  )

  const forgotPassword = useCallback(async (email: string) => {
    // redirectTo explicito: sin el, el link del mail aterriza en el "Site URL"
    // del proyecto Supabase (config externa al repo) y el usuario queda en la
    // home con la sesion de recovery, sin la pantalla para elegir password.
    // Requiere que la URL este en Authentication > URL Configuration > Redirect URLs.
    const { error } = await requireSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
  }, [])

  const resetPassword = useCallback(async (password: string, _passwordConfirmation: string) => {
    // Limpiamos must_change_password: cubre el reset normal y el cambio forzado
    // de usuarios migrados (el gate deja de redirigir tras esto).
    const { error } = await requireSupabase().auth.updateUser({
      password,
      data: { must_change_password: false }
    })
    if (error) throw error
  }, [])

  const refresh = useCallback(async () => {
    const { data } = await requireSupabase().auth.getSession()
    applySession(data.session)
  }, [applySession])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      register,
      login,
      loginWithProvider,
      logout,
      verifyEmail,
      verifyPhone,
      resendOtp,
      forgotPassword,
      resetPassword,
      refresh
    }),
    [
      user,
      status,
      register,
      login,
      loginWithProvider,
      logout,
      verifyEmail,
      verifyPhone,
      resendOtp,
      forgotPassword,
      resetPassword,
      refresh
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}

export default AuthContext
