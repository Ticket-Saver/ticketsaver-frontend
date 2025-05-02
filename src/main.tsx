import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import { AppRouter } from './router/Router'
import './index.css'
import 'unfonts.css'
import { MockAuth0Provider } from './mocks/mockAuth0Provider'

// Configuración Auth0 original (comentada para usar el mock)
const domain = import.meta.env.VITE_AUTH0_DOMAIN!
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID!

// Proveedor Auth0 original (comentado para usar el mock)
const Auth0ProviderWithNavigate: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const navigate = useNavigate()

  const onRedirectCallback = (appState?: { returnTo?: string }) => {
    navigate(appState?.returnTo || '/', { replace: true })
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      cacheLocation='localstorage'
      useRefreshTokens={true}
      authorizationParams={{ redirect_uri: window.location.origin }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
}

// Flag para alternar entre Auth0 real y mock
const USE_MOCK_AUTH = true

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {USE_MOCK_AUTH ? (
        <MockAuth0Provider>
          <AppRouter />
        </MockAuth0Provider>
      ) : (
        <Auth0ProviderWithNavigate>
          <AppRouter />
        </Auth0ProviderWithNavigate>
      )}
    </BrowserRouter>
  </React.StrictMode>
)
