import React, { createContext, useContext, useState, ReactNode } from 'react'

// Definición del contexto de autenticación mock
interface MockAuthContextValue {
  isAuthenticated: boolean
  user: any
  loginWithRedirect: () => void
  logout: () => void
  getAccessTokenSilently: () => Promise<string>
}

// Crear el contexto
const MockAuth0Context = createContext<MockAuthContextValue>({
  isAuthenticated: true,
  user: {
    name: 'Mock User',
    email: 'mock@example.com',
    picture: '/user.png',
    sub: 'mock|12345',
    phone_number: '+1234567890'
  },
  loginWithRedirect: () => {},
  logout: () => {},
  getAccessTokenSilently: async () => 'mock-token'
})

// Hook personalizado para usar el contexto mock
export const useAuth0 = () => useContext(MockAuth0Context)

// El proveedor mock de Auth0 que utilizaremos en lugar del proveedor real
export const MockAuth0Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated] = useState(true)
  const [user] = useState({
    name: 'Mock User',
    email: 'mock@example.com',
    picture: '/user.png',
    sub: 'mock|12345',
    phone_number: '+1234567890'
  })

  const loginWithRedirect = () => {
    console.log('Mock loginWithRedirect called')
  }

  const logout = () => {
    console.log('Mock logout called')
  }

  const getAccessTokenSilently = async () => {
    return 'mock-access-token'
  }

  const contextValue = {
    isAuthenticated,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently
  }

  return <MockAuth0Context.Provider value={contextValue}>{children}</MockAuth0Context.Provider>
}
