import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import { AppRouter } from './router/Router'
import './index.css'
import 'unfonts.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain='dev-4pb0l0ucwn1g88hs.us.auth0.com'
      clientId='jFPEy892pL5zwgp10PxicJGv6ww5FnTP'
      cacheLocation='localstorage'
      useRefreshTokens={true}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <AppRouter />
    </Auth0Provider>
  </React.StrictMode>
)
