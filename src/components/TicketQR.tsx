import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface TicketQRProps {
  // When provided, QR encodes this value directly (e.g., ticket id like "A-OPOHIP1")
  value?: string
  // Fallback legacy props to build a URL if value is not provided
  eventId?: number
  publicId?: string
  size?: number
}

export default function TicketQR({ value, eventId, publicId, size = 128 }: TicketQRProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateQR = async () => {
      if (canvasRef.current) {
        const qrValue =
          value ??
          (eventId !== undefined && publicId
            ? `http://localhost:5678/ticket/${eventId}/${publicId}`
            : undefined)

        try {
          if (!qrValue) return
          await QRCode.toCanvas(canvasRef.current, qrValue, {
            width: size,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          })
        } catch (error) {
          console.error('Error generating QR code:', error)
        }
      }
    }

    generateQR()
  }, [value, eventId, publicId, size])

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} />
      <p className="text-xs text-gray-600 mt-2 text-center">Escanea para ver el ticket</p>
    </div>
  )
}
