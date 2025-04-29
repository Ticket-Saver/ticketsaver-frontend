import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const LoginPage = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: location.pathname + location.search
      },
      authorizationParams: {
        screen_hint: 'signup'
      }
    })
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/protected')
    }
  }, [isAuthenticated, navigate])

  return (
    <div>
      <button onClick={handleLogin}>Log In</button>
    </div>
  )
}

export default LoginPage
