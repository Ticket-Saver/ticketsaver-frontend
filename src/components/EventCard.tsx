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
}

export function EventCard({
  title,
  city,
  date,
  description,
  thumbnailURL,
  color = 'bg-neutral',
  fontColor = 'text-neutral-content',
  venue
}: EventCardConfig) {
  return (
    <div
      className={`card ${color} ${fontColor} shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto`}
    >
      <figure className='w-full'>
        {thumbnailURL === 'none' ? (
          <img
            src='ticketsaver.png'
            className='w-full object-cover h-32 sm:h-40 md:h-48 lg:h-56 bg-white'
            alt='Default Event'
          />
        ) : (
          <img
            src={thumbnailURL}
            alt='Event'
            className='w-full object-cover h-32 sm:h-40 md:h-48 lg:h-56'
          />
        )}
      </figure>
      <div className='card-body px-4 py-6'>
        <div className='card-title'>
          <h2 className='text-lg font-semibold mb-2'>{title}</h2>
        </div>
        <h1 className='inline-block text-sm sm:text-base'>{city}</h1>
        <div className='inline-block'>
          <h2 className='badge badge-outline'>{venue}</h2>
          <h2 className='badge badge-outline'>{date}</h2>
        </div>
        <p className='text-sm sm:text-base'>{description}</p>
      </div>
    </div>
  )
}
