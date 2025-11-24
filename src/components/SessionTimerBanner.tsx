import { useEffect, useState } from 'react'
import { SessionTimerState } from '../hooks/useSessionTimer'

interface SessionTimerBannerProps {
  timerState: SessionTimerState
  onExpired?: () => void
}

/**
 * Banner visual simplificado que muestra el timer de sesión
 * Sin cambios de color, solo muestra el conteo
 */
export default function SessionTimerBanner({ timerState, onExpired }: SessionTimerBannerProps) {
  const { formattedTime, isExpired, hasStarted } = timerState
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

  return (
    <>
      {/* Banner principal - diseño simple y limpio */}
      <div className='fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white border-b border-gray-700 shadow-md'>
        <div className='max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between flex-wrap'>
            <div className='flex items-center'>
              <span className='text-xl mr-3'>⏱️</span>
              <div>
                <p className='font-semibold'>
                  {isExpired
                    ? 'Session Expired / Sesión Expirada'
                    : 'Time to Complete Purchase / Tiempo para Completar Compra'}
                </p>
              </div>
            </div>

            {/* Timer display - solo el conteo */}
            <div className='text-3xl font-mono font-bold'>
              {isExpired ? '00:00' : formattedTime}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer para que el contenido no quede debajo del banner */}
      <div className='h-16'></div>

      {/* Modal de expiración - diseño simplificado */}
      {showExpiredModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75'>
          <div className='bg-white rounded-lg p-8 max-w-md mx-4 shadow-xl'>
            <div className='text-center'>
              <div className='text-5xl mb-4'>⏰</div>
              <h2 className='text-xl font-bold mb-4 text-gray-900'>
                Session Expired
                <br />
                Sesión Expirada
              </h2>
              <p className='text-gray-600 mb-6 text-sm'>
                Your reservation time has expired. Your selected seats have been released.
                <br />
                <br />
                Tu tiempo de reserva ha expirado. Los asientos seleccionados han sido liberados.
              </p>
              <button
                onClick={() => {
                  setShowExpiredModal(false)
                  window.location.reload()
                }}
                className='bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded w-full'
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
