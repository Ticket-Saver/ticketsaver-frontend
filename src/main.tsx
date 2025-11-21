// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import { AppRouter } from './router/Router'
import './index.css'
import 'unfonts.css'

const domain = import.meta.env.VITE_AUTH0_DOMAIN!
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID!

// Wrapper que inyecta navigate a Auth0Provider
const Auth0ProviderWithNavigate: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const navigate = useNavigate()

  const onRedirectCallback = (appState?: { returnTo?: string }) => {
    // redirige a returnTo o a "/"
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Auth0ProviderWithNavigate>
      <AppRouter />
    </Auth0ProviderWithNavigate>
  </BrowserRouter>
  // </React.StrictMode>
)
