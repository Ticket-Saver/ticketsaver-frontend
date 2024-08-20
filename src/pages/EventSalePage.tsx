import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { extractZonePrices } from '../components/Utils/priceUtils'
import { fetchDescription, fetchGitHubImage } from '../components/Utils/FetchDataJson'

export default function EventPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { venue, name, date, label, delete: deleteParam } = useParams()
  const { sale_starts_at } = location.state || {}
  const [venues, setVenue] = useState<any>(null)
  const [description, setDescription] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [hour, setHour] = useState<string>('')

  const githubApiUrl = `${import.meta.env.VITE_GITHUB_API_URL as string}/venues.json`
  const githubApiUrl2 = `${import.meta.env.VITE_GITHUB_API_URL as string}/events.json`
  const token = import.meta.env.VITE_GITHUB_TOKEN
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3.raw'
    }
  }
  useEffect(() => {
    const fetchHour = async () => {
      try {
        const response = await fetch(githubApiUrl2, options)
        if (!response.ok) {
          throw new Error('response error')
        }
        const events = await response.json()
        const event = events[label!]
        if (event) {
          setHour(event.event_hour)
        }
      } catch (error) {
        console.error('Failed to fetch event hour:', error)
      }
    }

    if (label) {
      fetchHour()
    }
  }, [label, githubApiUrl2, options])

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

    const fetchVenues = async () => {
      const storedVenues = localStorage.getItem('Venues')
      localStorage.removeItem('Venues')

      if (storedVenues) {
        setVenue(JSON.parse(storedVenues))
      } else {
        try {
          const response = await fetch(githubApiUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github.v3.raw'
            }
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()

          const matchingVenue = data[venue!]
          setVenue(matchingVenue)
        } catch (error) {
          console.error('Error fetching data: ', error)
        }
      }
    }
    fetchVenues()
  }, [venue, githubApiUrl, token])

  const customUrl = `${import.meta.env.VITE_GITHUB_API_URL as string}/events/${label}/zone_price.json`
  const [zonePriceList, setZonePriceList] = useState<any[]>([])

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    const fetchDescriptions = async () => {
      const description = await fetchDescription(label!, options)

      setDescription(description)
    }

    if (label) {
      fetchDescriptions()
    }
  }, [label])

  useEffect(() => {
    const fetchImages = async () => {
      const image = await fetchGitHubImage(label!)
      setImage(image)
    }

    if (label) {
      fetchImages()
    }
  }, [label])

  const currentDate = new Date()
  const saleStartsAtDate = sale_starts_at ? new Date(sale_starts_at) : null
  const isSaleActive = saleStartsAtDate ? currentDate >= saleStartsAtDate : false

  return (
    <div className='bg-white'>
      <div className='bg-gray-100 relative'>
        {/* Event Header */}
        <div className='absolute inset-0'>
          {/* Cover Image */}
          <div className='relative h-96 bg-gray-500'>
            {/* Event Profile Image */}
            <div className='absolute inset-0 overflow-hidden'>
              <img
                src={image} // Replace with a default image
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
              {venues?.venue_name}, {venues?.location.city}
            </h2>
            <h2 className='text-4xl mb-4 bg-black bg-opacity-50 text-neutral-content rounded-lg px-10 py-2 inline-block max-w-full text-left mx-auto'>
              {hour} hrs,
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
                  {/* Static ticket data */}
                  {zonePriceList.map((zoneItem) => (
                    <tr key={zoneItem.zone}>
                      <th className='text-left font-normal'>{zoneItem.zone}</th>
                      <th className='text-center font-normal'>Starting prices from</th>
                      <th>
                        <a className='font-bold' style={{ fontSize: '14px' }}>
                          {' '}
                          $
                          {Math.min(...zoneItem.prices.map((price: any) => price.priceFinal)) /
                            100}{' '}
                          USD
                        </a>
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Buy Tickets Button */}
              <div className='mt-6'>
                <Link
                  to={`/sale/${name}/${venues?.venue_label}/${venues?.location.city}/${date}/${label}/${deleteParam}`}
                  className={`btn ${isSaleActive ? 'btn-active bg-blue-500 hover:bg-blue-600' : 'btn-disabled bg-gray-400'} text-white py-2 px-4 rounded w-full`}
                >
                  {isSaleActive ? 'Buy Tickets!' : `Tickets available on ${sale_starts_at}`}
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
            - {hour} hrs
          </h2>
          <h3 className='text-black'>Sobre el evento</h3>
          <p className='text-left'>{description}</p>
        </div>
        <div className='carousel carousel-center flex justify-center max-h-50 min-w-full abs'>
          <div className='carousel-item object-scale-down h-2/3 w-2/3 rounded-xl max-h-1/8 object-center'>
            <img src={image} />
          </div>
          <div className='carousel-item object-scale-down h-2/3 w-2/3 rounded-xl max-h-1/8 object-center'>
            <img src={image} />
          </div>
          <div className='carousel-item object-scale-down h-2/3 w-2/3 rounded-xl max-h-1/8 object-center'>
            <img src={image} />
          </div>
          <div className='carousel-item object-scale-down h-2/3 w-2/3 rounded-xl max-h-1/8 object-center'>
            <img src={image} />
          </div>
        </div>
      </div>
    </div>
  )
}
