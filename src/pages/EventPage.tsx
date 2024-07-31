import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { extractZonePrices } from '../components/Utils/priceUtils'

export default function EventPage() {
  const { venue, name, date, label } = useParams()
  const [venues, setVenue] = useState<any>(null)
  const githubApiUrl = `${import.meta.env.VITE_GITHUB_API_URL as string}/venues.json`
  const token = import.meta.env.VITE_GITHUB_TOKEN

  useEffect(() => {
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
          
          const matchingVenue = data[venue!];
          setVenue(matchingVenue)
        } catch (error) {
          console.error('Error fetching data: ', error)
        }
      }
    }
    fetchVenues()
  }, [venue, githubApiUrl, token])

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3.raw'
    }
  }

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
        console.log('eventData', zonePrices)
        const zonePriceListData = extractZonePrices(zonePrices)
        console.log('zonePriceList', zonePriceListData)
        setZonePriceList(zonePriceListData)
      } catch (error) {
        console.error('Error fetching zone prices', error)
      }
    }

    fetchZonePrices()
  }, [])

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
                src='/events/Leonas.jpg' // Replace with a default image
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
              {venues?.name}, {venues?.location.city}
            </h2>
            <div className='ml-auto md:w-96 sm:w-full text-black bg-white rounded-lg shadow-sm p-6'>
              <h2 className='text-lg font-bold mb-6'>Ticket Prices</h2>
              {/* Static Table */}
              <table className='w-full gap-y-2'>
                <thead>
                  <tr>
                    <th className='text-left'>Type</th>
                    <th className='text-right'>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Static ticket data */}
                  {zonePriceList.map((zoneItem) => (
                    <tr key={zoneItem.zone}>
                      <th className='text-left font-normal'>{zoneItem.zone}</th>
                      <th className='text-right font-normal'>
                        Starting prices from
                        <a className='font-bold'>
                          {' '}
                          ${Math.min(...zoneItem.prices.map((price: any) => price.priceBase)) / 100}
                        </a>
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Buy Tickets Button */}
              <div className='mt-6'>
                <Link
                  to={`/sale/${name}/${venues?.label}/${venues?.location.city}/${date}/${label}`}
                  className='btn btn-active bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full'
                >
                  Buy Tickets!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='w-3/4 mx-auto py-10 sm:px-2 lg:px-20'>
        {/* Event Description */}
        <div className='prose lg:prose-xl text-black w-full'>
          <h1 className='text-black '>US Tour</h1>
          <h2 className='text-black'>{date}</h2>
          <h3 className='text-black'>Sobre el evento</h3>
          <p className='text-left'>
            ¡No te pierdas en escena a: Victoria Ruffo, Angélica Aragón, Ana Patricia Rojo, Paola
            Rojas, María Patricia Castañeda, Dulce y Lupita Jones! ¡Una obra espectacular! Las
            protagonistas de esta puesta en escena dejan claro que el legado de una leona, al igual
            que el de una mujer, se construye diariamente. Las historias que se viven durante la
            obra nos ofrecen una visión realista del poder que tiene el ser humano para enfrentar
            las adversidades. Las Leonas te enseñarán cómo recuperar tu fuerza emocional, además te
            mostrarán el camino para liberarte de la culpa, evitar apegos y forjar tu propio
            destino, para que así encuentres a la leona que vive dentro de ti! Sé una Reina, pero
            ruge como una leona!! ¡No te la puedes perder!
          </p>
        </div>
        <div className='carousel carousel-center flex justify-center max-h-50 min-w-full abs'>
          <div className='carousel-item object-scale-down h-2/3 w-2/3 rounded-xl max-h-1/8 object-center'>
            <img src='/events/Leonas.jpg' />
          </div>
          <div className='carousel-item object-scale-down h-2/3 w-2/3 rounded-xl max-h-1/8 object-center'>
            <img src='/events/Leonas.jpg' />
          </div>
          <div className='carousel-item object-scale-down h-2/3 w-2/3 rounded-xl max-h-1/8 object-center'>
            <img src='/events/Leonas.jpg' />
          </div>
          <div className='carousel-item object-scale-down h-2/3 w-2/3 rounded-xl max-h-1/8 object-center'>
            <img src='/events/Leonas.jpg' />
          </div>
        </div>
      </div>
    </div>
  )
}
