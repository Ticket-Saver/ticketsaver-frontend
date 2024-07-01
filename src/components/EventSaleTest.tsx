
// DIRIGE A UN EVENTO YA CREADO DE STRIPE, TEMPORALMENTE.


export default function EventSaleTest() {
  const handleBuyNow = () => {
    window.location.href = "https://buy.stripe.com/test_6oE2apciodixaGs7ss";
  };

  return (
    <div className="bg-white">
         <div className="absolute inset-0">
          {/* Cover Image */}
          <div className="relative h-96 bg-gray-500">
            {/* Event Profile Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="public/events/Leonas.jpg" // Replace with a default image
                alt="Event Profile"
                className="w-full h-full object-cover overflow-hidden blur-sm object-top"
              />
            </div>
          </div>
        </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Event Description */}
        <div className="text-black relative">
          <h1 className="text-6xl font-bold mb-4 bg-primary-content bg-opacity-50 text-neutral-content rounded-lg px-10 py-2 inline-block max-w-full text-left mx-auto">
            Las Leonas
          </h1>
          <h2 className="text-4xl mb-4 bg-primary-content bg-opacity-50 text-neutral-content rounded-lg px-10 py-2 inline-block max-w-full text-left mx-auto">
            California Theater, San Jose, CA
          </h2>
          <div className="ml-auto md:w-96 sm:w-full text-black bg-white rounded-lg shadow-sm p-6">
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
                  <td className="text-left font-normal">Orchestra</td>
                  <td className="text-right font-normal">
                    Starting prices from <span className="font-bold">$22.80</span>
                  </td>
                
                </tr>
              </tbody>
            </table>
            {/* Buy Tickets Button */}
            <div className="mt-6">
              <button
                className="btn btn-active bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
                onClick={handleBuyNow}
              >
                BUY TICKETS!
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="w-3/4 mx-auto py-10 sm:px-2 lg:px-20">
        <div className="prose lg:prose-xl text-black">
          <h1 className="text-black">US Tour</h1>
          <h2 className="text-black">October 18th, 2024</h2>
          <h3 className="text-black">Event starts at 9:00pm</h3>
          <h3 className="text-black">Sobre el evento</h3>
          <p className="text-left">
            ¡No te pierdas en escena a: Victoria Ruffo, Angélica Aragón, Ana Patricia Rojo, Paola Rojas, María Patricia Castañeda, Dulce y Lupita Jones! ¡Una obra espectacular!
            Las protagonistas de esta puesta en escena dejan claro que el legado de una leona, al igual que el de una mujer, se construye diariamente. Las historias que se viven durante la obra nos ofrecen una visión realista del poder que tiene el ser humano para enfrentar las adversidades.
            Las Leonas te enseñarán cómo recuperar tu fuerza emocional, además te mostrarán el camino para liberarte de la culpa, evitar apegos y forjar tu propio destino, para que así encuentres a la leona que vive dentro de ti!
            Sé una Reina, pero ruge como una leona!! ¡No te la puedes perder!
          </p>
        </div>

        {/* Image Carousel */}
        <div className="carousel carousel-center flex justify-center max-h-50 min-w-full abs">
          <div className="carousel-item object-scale-down h-2/3 w-2/3 rounded-xl max-h-1/8 object-center">
            <img src="public/events/Leonas.jpg" alt="Carousel Image" />
          </div>
          <div className="carousel-item object-scale-down h-2/3 w-2/3 rounded-xl max-h-1/8 object-center">
            <img src="public/events/Leonas.jpg" alt="Carousel Image" />
          </div>
          <div className="carousel-item object-scale-down h-2/3 w-2/3 rounded-xl max-h-1/8 object-center">
            <img src="public/events/Leonas.jpg" alt="Carousel Image" />
          </div>
          <div className="carousel-item object-scale-down h-2/3 w-2/3 rounded-xl max-h-1/8 object-center">
            <img src="public/events/Leonas.jpg" alt="Carousel Image" />
          </div>
        </div>
      </div>
    </div>
  );
}
