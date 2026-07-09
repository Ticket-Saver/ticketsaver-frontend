import { useAuth0 } from '@auth0/auth0-react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'
import ProtectedPage from '../protectedPage'
import CheckoutPage from '../pages/checkout'
import DesignCheck from '../pages/v2/_DesignCheck'
import LayoutCheck from '../pages/v2/_LayoutCheck'
import HomeV2 from '../pages/v2/HomeV2'
import EventsV2 from '../pages/v2/EventsV2'
import EventDetailV2 from '../pages/v2/EventDetailV2'
import SaleV2 from '../pages/v2/SaleV2'
import SaleCheck from '../pages/v2/_SaleCheck'
import TicketReceivedV2 from '../pages/v2/TicketReceivedV2'
import TicketPublicV2 from '../pages/v2/TicketPublicV2'
import MyTicketsV2 from '../pages/v2/MyTicketsV2'
import UpcomingV2 from '../pages/v2/dashboardTabs/UpcomingV2'
import PastV2 from '../pages/v2/dashboardTabs/PastV2'
import QueueV2 from '../pages/v2/QueueV2'
import DashboardV2 from '../pages/v2/DashboardV2'
import MyProfileV2 from '../pages/v2/MyProfileV2'
import Web3V2 from '../pages/v2/Web3V2'
import MySettingsV2 from '../pages/v2/MySettingsV2'
import YouNeedHelpV2 from '../pages/v2/YouNeedHelpV2'
import AboutV2 from '../pages/v2/AboutV2'
import ContactV2 from '../pages/v2/ContactV2'
import FaqsV2 from '../pages/v2/FaqsV2'
import TermsV2 from '../pages/v2/TermsV2'
import PrivacyV2 from '../pages/v2/PrivacyV2'
import PCIV2 from '../pages/v2/PCIV2'
import { useParams } from 'react-router-dom'
import { VenuesProvider } from '../router/venuesContext'
import { EventsProvider } from '../router/eventsContext'
import { CartProvider } from '../router/cartContext'
import { useLocation } from 'react-router-dom'

const SaleRoute = () => {
  const { label } = useParams<{ label: string }>()
  // eid (query) = eventId numérico único; en multifecha desambigua la fecha.
  const eid = new URLSearchParams(useLocation().search).get('eid') ?? undefined
  return label ? <SaleV2 eventLabel={label} eventId={eid} /> : <Navigate to='/events' />
}

// Auth0 sólo se exige si está configurado (producción). Mientras no haya
// credenciales Auth0 en local (migración futura a login custom), no bloqueamos:
// se deja pasar para poder probar el flujo de compra de punta a punta.
const authConfigured = Boolean(import.meta.env.VITE_AUTH0_DOMAIN)

const ProtectedRoute = ({ element }: { element: ReactNode }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0()
  if (!authConfigured) return <>{element}</>
  if (!isAuthenticated) {
    loginWithRedirect({
      appState: { returnTo: location.pathname + location.search },
      authorizationParams: {
        screen_hint: 'signup'
      }
    })
    return null
  }
  return isAuthenticated ? element : <Navigate to="/" />
}

export const AppRouter = () => (
  <VenuesProvider>
    <EventsProvider>
      <CartProvider>
        {/* Envolvemos las rutas con providers: venues, events y carrito */}
        <Routes>
          <Route path='/_design-check' element={<DesignCheck />} />
          <Route path='/_layout-check' element={<LayoutCheck />} />
          <Route path='/_sale-check' element={<SaleCheck />} />

          <Route path='/' element={<HomeV2 />} />

          <Route path='/checkout' element={<ProtectedRoute element={<CheckoutPage />} />} />
          {/* Post-pago: la pantalla de ticket de Claude Design (TicketCard NFT
              + Apple Wallet + Share), alimentada por el flujo HiEvents. */}
          <Route
            path='/checkout/:venueId/:orderShortId/success'
            element={<TicketReceivedV2 />}
          />

          {/* Ticketera pública: destino del "View Ticket" del mail y del QR.
              Sin login (el public_id es el secreto). */}
          <Route path='/ticket/:eventId/:publicId' element={<TicketPublicV2 />} />

          <Route path='return' element={<TicketReceivedV2 />} />

          <Route path='/protected' element={<ProtectedRoute element={<ProtectedPage />} />} />

          <Route path='/footer/contact' element={<ContactV2 />} />
          <Route path='/footer/terms&conditions' element={<TermsV2 />} />
          <Route path='/footer/PrivayPolicy' element={<PrivacyV2 />} />
          <Route path='/footer/PCICompliance' element={<PCIV2 />} />
          <Route path='/faqs' element={<FaqsV2 />} />
          <Route path='/about' element={<AboutV2 />} />

          <Route path='/events' element={<EventsV2 />} />

          <Route path='/event/:id/:slug?' element={<EventDetailV2 />} />

          <Route
            path='/sale/:name/:venue/:location/:date/:label/:delete?'
            element={<SaleRoute />}
          />

          <Route path='/queue/:label' element={<QueueV2 />} />

          {/* /dashboard/tickets/* — v2 standalone con LayoutV2. */}
          <Route
            path='/dashboard/tickets'
            element={<ProtectedRoute element={<MyTicketsV2 />} />}
          >
            <Route index element={<Navigate to='upcomingevent' replace />} />
            <Route path='upcomingevent' element={<UpcomingV2 />} />
            <Route path='pastevent' element={<PastV2 />} />
            {/* 'collectibles' (NFT) eliminado — NFT/Web3 fuera del proyecto. */}
            <Route path='collectibles' element={<Navigate to='../pastevent' replace />} />
          </Route>

          <Route
            path='/dashboard'
            element={<ProtectedRoute element={<DashboardV2 />} />}
          >
            <Route index element={<Navigate to='profile' replace />} />
            <Route path='profile' element={<MyProfileV2 />} />
            <Route path='web3' element={<Web3V2 />} />
            <Route path='settings' element={<MySettingsV2 />} />
            <Route path='help' element={<YouNeedHelpV2 />} />
          </Route>
        </Routes>
      </CartProvider>
    </EventsProvider>
  </VenuesProvider>
)
