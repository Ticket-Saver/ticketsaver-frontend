import { useEffect, useState } from 'react'
import { SessionTimerState } from '../hooks/useSessionTimer'

interface SessionTimerBannerProps {
  timerState: SessionTimerState
  onExpired?: () => void
}

/**
 * Banner visual que muestra el timer de sesión
 *
 * Estados visuales:
 * - Verde: > 3 minutos
 * - Amarillo: 1-3 minutos (warning)
 * - Rojo: < 1 minuto (critical)
 * - Gris: Expirado
 */
export default function SessionTimerBanner({ timerState, onExpired }: SessionTimerBannerProps) {
  const { formattedTime, isExpired, isWarning, isCritical, hasStarted } = timerState
  const [showExpiredModal, setShowExpiredModal] = useState(false)

  // Mostrar modal cuando expira
  useEffect(() => {
    if (isExpired && hasStarted) {
      setShowExpiredModal(true)
      onExpired?.()
    }
  }, [isExpired, hasStarted, onExpired])

  // No mostrar nada si no ha iniciado
  if (!hasStarted) {
    return null
  }

  // Determinar colores según estado
  const getBannerColors = () => {
    if (isExpired) {
      return {
        bg: 'bg-gray-600',
        text: 'text-white',
        border: 'border-gray-700',
        icon: '⏰'
      }
    }
    if (isCritical) {
      return {
        bg: 'bg-red-600 animate-pulse',
        text: 'text-white',
        border: 'border-red-700',
        icon: '🚨'
      }
    }
    if (isWarning) {
      return {
        bg: 'bg-yellow-500',
        text: 'text-black',
        border: 'border-yellow-600',
        icon: '⚠️'
      }
    }
    return {
      bg: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-700',
      icon: '⏱️'
    }
  }

  const colors = getBannerColors()

  return (
    <>
      {/* Banner principal */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 ${colors.bg} ${colors.text} border-b-2 ${colors.border} shadow-lg`}
      >
        <div className='max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between flex-wrap'>
            <div className='flex items-center'>
              <span className='text-2xl mr-3'>{colors.icon}</span>
              <div>
                <p className='font-bold text-lg'>
                  {isExpired
                    ? 'Session Expired / Sesión Expirada'
                    : 'Time to Complete Purchase / Tiempo para Completar Compra'}
                </p>
                {!isExpired && (
                  <p className='text-sm opacity-90'>
                    {isCritical
                      ? 'Complete your purchase now! / ¡Completa tu compra ahora!'
                      : isWarning
                        ? 'Hurry up! / ¡Date prisa!'
                        : 'Your seats are reserved / Tus asientos están reservados'}
                  </p>
                )}
              </div>
            </div>

            {/* Timer display */}
            <div className='flex items-center'>
              <div
                className={`text-4xl font-mono font-bold ${isExpired ? 'opacity-50' : ''} ${isCritical ? 'animate-pulse' : ''}`}
              >
                {isExpired ? '00:00' : formattedTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer para que el contenido no quede debajo del banner */}
      <div className='h-20'></div>

      {/* Modal de expiración */}
      {showExpiredModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75'>
          <div className='bg-white rounded-lg p-8 max-w-md mx-4 shadow-2xl'>
            <div className='text-center'>
              <div className='text-6xl mb-4'>⏰</div>
              <h2 className='text-2xl font-bold mb-4 text-gray-900'>
                Session Expired
                <br />
                Sesión Expirada
              </h2>
              <p className='text-gray-700 mb-6'>
                Your reservation time has expired. Your selected seats have been released and are
                now available for other customers.
                <br />
                <br />
                Tu tiempo de reserva ha expirado. Los asientos seleccionados han sido liberados y
                están disponibles para otros clientes.
              </p>
              <button
                onClick={() => {
                  setShowExpiredModal(false)
                  window.location.reload() // Recargar página para empezar de nuevo
                }}
                className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full'
              >
                Start Over / Empezar de Nuevo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
