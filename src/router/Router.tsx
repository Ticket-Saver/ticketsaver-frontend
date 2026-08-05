import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CheckoutPage from '../pages/checkout'
import LoginV2 from '../pages/v2/LoginV2'
import RegisterV2 from '../pages/v2/RegisterV2'
import VerifyEmailV2 from '../pages/v2/VerifyEmailV2'
import VerifyPhoneV2 from '../pages/v2/VerifyPhoneV2'
import ForgotPasswordV2 from '../pages/v2/ForgotPasswordV2'
import ResetPasswordV2 from '../pages/v2/ResetPasswordV2'
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
import ResalesV2 from '../pages/v2/dashboardTabs/ResalesV2'
import ResaleMarketV2 from '../pages/v2/ResaleMarketV2'
import ResaleEventV2 from '../pages/v2/ResaleEventV2'
import QueueV2 from '../pages/v2/QueueV2'
import DashboardV2 from '../pages/v2/DashboardV2'
import MyProfileV2 from '../pages/v2/MyProfileV2'
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

const SaleRoute = () => {
  const { label } = useParams<{ label: string }>()
  // eid (query) = eventId numérico único; en multifecha desambigua la fecha.
  const eid = new URLSearchParams(useLocation().search).get('eid') ?? undefined
  return label ? <SaleV2 eventLabel={label} eventId={eid} /> : <Navigate to='/events' />
}

/** Si hay sesión, debe estar verificada (email Y teléfono). Anónimo pasa. */
const VerifiedGate = () => {
  const { status, user } = useAuth()
  const location = useLocation()
  const returnTo = location.pathname + location.search
  if (status === 'loading') return null
  if (user && !user.emailVerified) {
    return <Navigate to='/verify-email' state={{ email: user.email, returnTo }} replace />
  }
  if (user && !user.phoneVerified) {
    return <Navigate to='/verify-phone' state={{ returnTo }} replace />
  }
  return <Outlet />
}

/** Además de verificada, exige sesión (rutas de compra/dashboard). */
const RequireAuth = () => {
  const { status } = useAuth()
  const location = useLocation()
  if (status === 'loading') return null
  if (status === 'unauthenticated') {
    return (
      <Navigate to='/login' state={{ returnTo: location.pathname + location.search }} replace />
    )
  }
  return <Outlet />
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

          {/* Ticketera pública: destino del "View Ticket" del mail y del QR.
              Sin login (el public_id es el secreto). */}
          <Route path='/ticket/:eventId/:publicId' element={<TicketPublicV2 />} />

          <Route path='/login' element={<LoginV2 />} />
          <Route path='/register' element={<RegisterV2 />} />
          <Route path='/verify-email' element={<VerifyEmailV2 />} />
          <Route path='/verify-phone' element={<VerifyPhoneV2 />} />
          <Route path='/forgot-password' element={<ForgotPasswordV2 />} />
          <Route path='/reset-password' element={<ResetPasswordV2 />} />

          <Route path='/footer/contact' element={<ContactV2 />} />
          <Route path='/footer/terms&conditions' element={<TermsV2 />} />
          <Route path='/footer/PrivayPolicy' element={<PrivacyV2 />} />
          <Route path='/footer/PCICompliance' element={<PCIV2 />} />
          <Route path='/faqs' element={<FaqsV2 />} />
          <Route path='/about' element={<AboutV2 />} />

          <Route element={<VerifiedGate />}>
            <Route path='/' element={<HomeV2 />} />
            <Route path='/events' element={<EventsV2 />} />
            <Route path='/event/:id/:slug?' element={<EventDetailV2 />} />

            <Route element={<RequireAuth />}>
              <Route
                path='/sale/:name/:venue/:location/:date/:label/:delete?'
                element={<SaleRoute />}
              />

              <Route path='/checkout' element={<CheckoutPage />} />
              {/* Post-pago: la pantalla de ticket de Claude Design (TicketCard
                  + Apple Wallet + Share), alimentada por el flujo HiEvents. */}
              <Route
                path='/checkout/:venueId/:orderShortId/success'
                element={<TicketReceivedV2 />}
              />

              <Route path='return' element={<TicketReceivedV2 />} />

              <Route path='/queue/:label' element={<QueueV2 />} />

              {/* Marketplace de reventa: grid global y vista por evento. */}
              <Route path='/reventa' element={<ResaleMarketV2 />} />
              <Route path='/reventa/:eventId' element={<ResaleEventV2 />} />

              {/* /dashboard/tickets/* — v2 standalone con LayoutV2. */}
              <Route path='/dashboard/tickets' element={<MyTicketsV2 />}>
                <Route index element={<Navigate to='upcomingevent' replace />} />
                <Route path='upcomingevent' element={<UpcomingV2 />} />
                <Route path='pastevent' element={<PastV2 />} />
                <Route path='resales' element={<ResalesV2 />} />
                {/* 'collectibles' (NFT) eliminado — NFT/Web3 fuera del proyecto. */}
                <Route path='collectibles' element={<Navigate to='../pastevent' replace />} />
              </Route>

              <Route path='/dashboard' element={<DashboardV2 />}>
                <Route index element={<Navigate to='profile' replace />} />
                <Route path='profile' element={<MyProfileV2 />} />
                <Route path='settings' element={<MySettingsV2 />} />
                <Route path='help' element={<YouNeedHelpV2 />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </CartProvider>
    </EventsProvider>
  </VenuesProvider>
)
