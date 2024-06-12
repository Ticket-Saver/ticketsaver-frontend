import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import { AppRouter } from './router/Router';
import './index.css'
import 'unfonts.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-85h1fnlvqdv1rdt4.us.auth0.com"
      clientId="OsczPJLpO7ff8tRzIda8Q31pus3HEPk6"
      cacheLocation="localstorage" 
      useRefreshTokens={true} 
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <AppRouter />
    </Auth0Provider>
  </React.StrictMode>
);


