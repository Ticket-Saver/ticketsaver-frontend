import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function EventPage() {

  const { venue, name, date } = useParams();

  console.log(venue, date, name);
  const [venues, setVenue] = useState<any>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      const githubApiUrl = `${import.meta.env.VITE_GITHUB_API_URL as string}/venues.json`
      const token = import.meta.env.VITE_GITHUB_TOKEN
      const storedVenues = localStorage.getItem('Venues');

      if (storedVenues) {
        setVenue(JSON.parse(storedVenues));
      } else {
        try {
          const response = await fetch(githubApiUrl, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/vnd.github.v3.raw'
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const matchingVenue = data.find((venueItem: any) => venueItem.label === venue);
          setVenue(matchingVenue);
          console.log(matchingVenue);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      }
    };
    fetchVenues();
  }, [venue]);

  return (
    <div className="bg-white">
      <div className="bg-gray-100 relative">
        {/* Event Header */}
        <div className="absolute inset-0">
          {/* Cover Image */}
          <div className="relative h-96 bg-gray-500">
            {/* Event Profile Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="/IndiaYuridia.png" // Replace with a default image
                alt="Event Profile"
                className="w-full h-full object-cover overflow-hidden blur-sm object-top"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Event Description */}
          <div className="text-primary-content relative">
            <h1 className="text-6xl font-bold mb-4 bg-primary-content bg-opacity-50 text-neutral-content rounded-lg px-10 py-2 inline-block max-w-full text-left mx-auto ">
              {name}
            </h1>
            <h2 className="text-4xl mb-4 bg-primary-content bg-opacity-50 text-neutral-content rounded-lg px-10 py-2 inline-block max-w-full text-left mx-auto">
              {venues?.name}, {venues?.location.city}
            </h2>
            <div className="ml-auto md:w-96 sm:w-full text-primary-content bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold mb-6">Ticket Prices</h2>
              {/* Static Table */}
              <table className="w-full gap-y-2">
                <thead>
                  <tr>
                    <th className="text-left">Type</th>
                    <th className="text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Static ticket data */}
                  <tr>
                    <th className="text-left font-normal">Loge</th>
                    <th className="text-right font-normal">
                      Starting prices from
                      <a className="font-bold"> $59</a>
                    </th>
                  </tr>
                  <tr>
                    <th className="text-left font-normal">Orchestra</th>
                    <th className="text-right font-normal">
                      Starting prices from
                      <a className="font-bold"> $99</a>
                    </th>
                  </tr>
                </tbody>
              </table>
              {/* Buy Tickets Button */}
              <div className="mt-6">
                <Link to={`/sale/india_yuridia.01`} className="btn btn-active bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full">
                  Buy Tickets!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-3/4 mx-auto py-10 sm:px-2 lg:px-20">
        {/* Event Description */}
        <div className="prose lg:prose-xl text-black w-full">
          <h1 className="text-black ">Porque asi soy</h1>
          <h2 className="text-black">{date}</h2>
          <h3 className="text-black">Sobre el evento</h3>
          <p className="text-left">
            ¡Llega por primera vez a New Jersey la comediante femenina #1 de América Latina!! ¡La India Yuridia! No te pierdas su nueva gira “Por que Asi Soy” donde te garantizamos pasaras una noche de risas junto a toda tu familia! ¡Compra tus boletos antes de que se agoten!
          </p>
        </div>
        <div className="carousel carousel-center flex justify-center max-h-50 min-w-full abs">
          <div className="carousel-item object-scale-down h-2/3 w-2/3 rounded-xl max-h-1/8 object-center">
            <img src="/IndiaYuridia.png" />
          </div>
          <div className="carousel-item object-scale-down h-2/3 w-2/3 rounded-xl max-h-1/8 object-center">
            <img src="/IndiaYuridia.png" />
          </div>
          <div className="carousel-item object-scale-down h-2/3 w-2/3 rounded-xl max-h-1/8 object-center">
            <img src="/IndiaYuridia.png" />
          </div>
          <div className="carousel-item object-scale-down h-2/3 w-2/3 rounded-xl max-h-1/8 object-center">
            <img src="/IndiaYuridia.png" />
          </div>
        </div>

      </div>
    </div>
  );
}
