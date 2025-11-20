// App.tsx
import { BrowserRouter, useNavigate, Routes, Route } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import FeaturedEvents from './components/FeaturedEvents'
import Layout from './components/Layout'
import EventDetails from './components/EventDetails'
import Checkout from './components/Checkout'
import Success from './components/Success'
import Cancel from './components/Cancel'

const queryClient = new QueryClient()
const domain = import.meta.env.VITE_AUTH0_DOMAIN!
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID!

function Auth0Wrapper({ children }: React.PropsWithChildren) {
  const navigate = useNavigate()
  const onRedirectCallback = (appState?: { returnTo?: string }) => {
    navigate(appState?.returnTo || '/', { replace: true })
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      authorizationParams={{ redirect_uri: window.location.origin }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Auth0Wrapper>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<FeaturedEvents />} />
              <Route
                path="/event/:eventName/:eventId/:eventDate/:eventLabel/:eventDeletedAt"
                element={<EventDetails />}
              />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
            </Route>
          </Routes>
        </Auth0Wrapper>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
