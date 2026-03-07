import { useState, useEffect } from 'react'

export default function CoverCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    // {
    //   id: 1,
    //   imageUrl: '/events/turbulence-sf.jpg',
    //   caption: 'Welcome to Ticketsaver!'
    // },
    // {
    //   id: 2,
    //   imageUrl: '/events/IndiaYuridia.jpg',
    //   caption: 'Discover amazing events!'
    // },
    // {
    //   id: 3,
    //   imageUrl: '/events/Leonas.jpg',
    //   caption: 'We save you the seats so you can savour the night'
    // },
    // {
    //   id: 4,
    //   imageUrl: '/events/turbulence-sf.jpg',
    //   caption: ''
    // },
    // {
    //   id: 5,
    //   imageUrl: '/events/turbulence-sj.jpg',
    //   caption: ''
    // }
    {
      id: 1,
      imageUrl: '/events/alucines-1.jpg',
      caption: ''
    },
    {
      id: 2,
      imageUrl: '/events/alucines-2.jpg',
      caption: ''
    }
  ]

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1))
    }, 6000) // 6 seconds interval

    return () => clearInterval(intervalId)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1))
  }

  return (
    <div className='carousel-container relative w-full'>
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`carousel-item ${
            index === currentSlide ? 'opacity-100' : 'opacity-0 hidden'
          } flex justify-center items-center transition-opacity duration-500`}
          onClick={() => console.log('click a', slide.id)}
        >
          <div className='w-full relative bg-black flex justify-center overflow-hidden md:h-[60vh]'>
            {/* Fondo difuminado, solo visible en desktop (md+) */}
            <div
              className='hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat blur-xl opacity-40 scale-110'
              style={{ backgroundImage: `url(${slide.imageUrl})` }}
            />

            {/* Imagen principal: Full width en mobile, contenida y centrada en desktop */}
            <img
              src={slide.imageUrl}
              alt={`Slide ${slide.id}`}
              className='w-full object-cover md:object-contain relative z-10'
              style={{
                height: 'auto',
                maxHeight: '100%' // En desktop no pasará de los 60vh del padre
              }}
            />
            {slide.caption && (
              <div className='absolute bottom-4 left-0 w-full flex justify-center z-20'>
                <div className='bg-black bg-opacity-70 rounded-lg py-2 px-4 backdrop-blur-sm shadow-xl'>
                  <h1 className='text-white text-2xl md:text-4xl font-bold'>{slide.caption}</h1>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      <button
        className='absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 btn btn-circle btn-sm md:btn-lg bg-white bg-opacity-30 backdrop-blur-sm text-white border-none hover:bg-opacity-50 z-30'
        onClick={prevSlide}
      >
        ❮
      </button>
      <button
        className='absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 btn btn-circle btn-sm md:btn-lg bg-white bg-opacity-30 backdrop-blur-sm text-white border-none hover:bg-opacity-50 z-30'
        onClick={nextSlide}
      >
        ❯
      </button>
    </div>
  )
}
