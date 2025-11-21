export interface EventCardConfig {
  eventId: string
  id: string
  title: string
  description: string
  thumbnailURL: string
  date: string
  color?: string
  fontColor?: string
  venue?: string
  city?: string
  address?: string
}

export function EventCard({
  title,
  city,
  date,
  description,
  thumbnailURL,
  color = 'bg-neutral',
  fontColor = 'text-neutral-content',
  venue = '',
  address = ''
}: EventCardConfig) {
  const isSmallScreen = useIsSmallScreen()

  return (
    <div
      className={`card ${color} ${fontColor} shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer w-full max-w-md mx-auto`}
    >
      <figure className='w-full'>
        {thumbnailURL === 'none' ? (
          <img
            src='ticketsaver.png'
            className='w-full h-56 sm:h-60 object-cover bg-white mx-auto'
            alt='Default Event'
          />
        ) : (
          <img
            src={thumbnailURL}
            alt='Event'
            className='w-full h-56 sm:h-60 object-cover mx-auto'
          />
        )}
      </figure>
      <div className='card-body px-4 py-6'>
        <div className='card-title'>
          <h2 className='text-lg font-semibold mb-2'>{title}</h2>
        </div>
        <h1 className='inline-block text-sm sm:text-base'>{address || city}</h1>
        <div className='inline-block space-y-2 space-x-2'>
          <h2 className='badge badge-outline '>
            {' '}
            {isSmallScreen ? truncateText(venue, 27) : venue}
          </h2>
          <h2 className='badge badge-outline'>{date}</h2>
        </div>
        <p className='text-sm sm:text-base line-clamp-3'>{description}</p>
      </div>
    </div>
  )
}

function truncateText(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.slice(0, maxLength - 3) + '...'
  }
  return text
}

import { useEffect, useState } from 'react'

function useIsSmallScreen() {
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)')
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsSmallScreen(e.matches)
    }

    setIsSmallScreen(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleMediaQueryChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange)
    }
  }, [])

  return isSmallScreen
}
