import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { extractZonePrices } from '../components/Utils/priceUtils'
import { fetchDescription, fetchGitHubImage } from '../components/Utils/FetchDataJson'
import { useVenues } from '../router/venuesContext'
import { useEvents } from '../router/eventsContext'

export default function EventPage() {
  const navigate = useNavigate()
  const { venue, name, date, label, delete: deleteParam } = useParams()

  const { venues } = useVenues()
  const { events } = useEvents()

  const matchingVenue = venues ? venues[venue!] : null
  const eventData = events ? events[label!] : null

  const [description, setDescription] = useState<string>('')
  const [image, setImage] = useState<string>('')

  const hour = eventData?.event_hour || ''
  const saleStartsAt = eventData?.sale_starts_at || ''

  const [zonePriceList, setZonePriceList] = useState<any[]>([])
  const eventsWithFees = [
    'ice_spice.01',
    'bossman_dlow.01',
    'bigxthaplug.01',
    'geazy_claytons.01',
    'deorro_claytons.01',
    'deebaby_zro.01',
    'yeri_mua.01',
    'insane_clown_posse.01',
    'nestor_420.01'
  ]
  const eventsDoors: { [key: string]: string } = {
    'marisela.01': '19:00hrs',
    'bossman_dlow.01': '8:00 PM',
    'bigxthaplug.01': '8:00 PM',
    'geazy_claytons.01': '8:00 PM',
    'insane_clown_posse.01': '8:00 PM'
  }
  const doorHour = label && eventsDoors[label] ? eventsDoors[label] : hour

  // Redirigir si se debe borrar o si la fecha ya expiró
  useEffect(() => {
    if (deleteParam === 'delete') {
      navigate('/')
      return
    }
    const currentDate = new Date()
    const endDate = date ? new Date(date) : new Date()
    endDate.setDate(endDate.getDate() + 2)
    if (currentDate.getTime() > endDate.getTime()) {
      navigate('/')
      return
    }
  }, [deleteParam, date, navigate])

  const token = import.meta.env.VITE_GITHUB_TOKEN
  const options = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3.raw'
      }
    }),
    [token]
  )
  const customUrl = useMemo(
    () => `${import.meta.env.VITE_GITHUB_API_URL as string}/events/${label}/zone_price.json`,
    [label]
  )
  // Fetch de zone prices (se actualiza cada vez que carga la página)
  useEffect(() => {
    if (!label) return
    const fetchZonePrices = async () => {
      try {
        const response = await fetch(customUrl, options)
        if (!response.ok) {
          throw new Error('response error')
        }
        const zonePrices = await response.json()
        const zonePriceListData = extractZonePrices(zonePrices)
        setZonePriceList(zonePriceListData)
      } catch (error) {
        console.error('Error fetching zone prices', error)
      }
    }
    fetchZonePrices()
  }, [customUrl, options, label])

  // Fetch de descripción
  useEffect(() => {
    if (!label) return
    const fetchDescriptions = async () => {
      const desc = await fetchDescription(label, options)
      setDescription(desc)
    }
    fetchDescriptions()
  }, [label, options])

  // Fetch de imagen (se ejecuta solo cuando label cambia)
  useEffect(() => {
    if (!label) return
    const fetchImages = async () => {
      const img = await fetchGitHubImage(label)
      setImage(img)
    }
    fetchImages()
  }, [label])

  const currentDate = new Date()
  const saleStartsAtDate = saleStartsAt ? new Date(saleStartsAt) : null
  const isSaleActive = saleStartsAtDate ? currentDate >= saleStartsAtDate : false

  return (
    <div className='bg-white'>
      <div className='bg-gray-100 relative'>
        {/* Event Header */}
        <div className='absolute inset-0 '>
          {/* Cover Image */}
          <div className='relative h-96 bg-gray-500'>
            {/* Event Profile Image */}
            <div className='relative h-96'>
              <img
                src={image}
                alt='Event Profile'
                className='w-full h-full object-cover overflow-hidden blur-sm object-top'
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
          {/* Event Description */}
          <div className='text-primary-content relative'>
            <h1 className='text-6xl font-bold mb-4 bg-black bg-opacity-50 text-neutral-content rounded-lg px-10 py-2 inline-block max-w-full text-left mx-auto '>
              {name}
            </h1>
            <h2 className='text-4xl mb-4 bg-black bg-opacity-50 text-neutral-content rounded-lg px-10 py-2 inline-block max-w-full text-left mx-auto'>
              {matchingVenue?.venue_name}, {matchingVenue?.location.city}
            </h2>
            <h2 className='text-4xl mb-4 bg-black bg-opacity-50 text-neutral-content rounded-lg px-10 py-2 inline-block max-w-full text-left mx-auto'>
              Doors {doorHour}
            </h2>
            <div className='ml-auto md:w-96 sm:w-full text-black bg-white rounded-lg shadow-sm p-6'>
              <h2 className='text-lg font-bold mb-6'>Ticket Prices</h2>
              {/* Static Table */}
              <table className='w-full gap-y-2'>
                <thead>
                  <tr>
                    <th className='text-left'>Type</th>
                    <th className='text-center'></th>
                    <th className='text-right'>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {zonePriceList.map((zoneItem) => (
                    <tr key={zoneItem.zone}>
                      <th className='text-left font-normal'>{zoneItem.zone}</th>
                      <th className='text-center font-normal'>Starting prices from</th>
                      <th>
                        <a className='font-bold' style={{ fontSize: '14px' }}>
                          {eventsWithFees.includes(label!)
                            ? `${Math.min(...zoneItem.prices.map((price: any) => price.priceBase)) / 100} USD + fees`
                            : `${Math.min(...zoneItem.prices.map((price: any) => price.priceFinal)) / 100} USD`}
                        </a>
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Buy Tickets Button */}
              <div className='mt-6'>
                <Link
                  to={`/sale/${name}/${matchingVenue?.venue_label}/${matchingVenue?.location.city}/${date}/${label}/${deleteParam}`}
                  className={`btn ${
                    isSaleActive
                      ? 'btn-active bg-blue-500 hover:bg-blue-600'
                      : 'btn-disabled bg-gray-400'
                  } text-white py-2 px-4 rounded w-full`}
                >
                  {isSaleActive ? 'Buy Tickets!' : `Tickets available on ${saleStartsAt}`}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='w-3/4 mx-auto py-10 sm:px-2 lg:px-20'>
        {/* Event Description */}
        <div className='prose lg:prose-xl text-black w-full'>
          <h1 className='text-black '>{name}</h1>
          <h2 className='text-black'>
            {new Date(date!)
              .toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                timeZone: 'UTC'
              })
              .replace(',', '')}{' '}
            - {hour}
          </h2>
          <h3 className='text-black'>Event Info</h3>
          <p className='text-left' style={{ whiteSpace: 'pre-wrap' }}>
            {description}
          </p>
        </div>
        <div className='flex justify-center items-center py-8'>
          <div className='w-2/3 h-2/3'>
            <img
              src={image}
              alt='Event image'
              className='object-scale-down rounded-xl w-full h-full'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
