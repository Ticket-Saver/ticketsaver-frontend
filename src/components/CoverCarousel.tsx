import { useState, useEffect } from 'react'

export default function CoverCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    {
      id: 1,
      imageUrl: '/events/marisela.png',
      caption: 'Welcome to Ticketsaver!'
    },
    {
      id: 2,
      imageUrl: '/events/marisela.png',
      caption: 'Discover amazing events!'
    },
    {
      id: 3,
      imageUrl: '/events/marisela.png',
      caption: 'We save you the seats so you can savour the night'
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
    <div className='carousel-container relative w-full overflow-hidden'>
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`carousel-item ${
            index === currentSlide ? 'opacity-100' : 'opacity-0 hidden'
          } flex justify-center items-center transition-opacity duration-500`}
          onClick={() => console.log('click a', slide.id)}
        >
          <div className='w-full relative h-96 md:h-[500px] lg:h-[600px]'>
            <img
              src={slide.imageUrl}
              alt={`Slide ${slide.id}`}
              className='w-full h-full object-contain bg-gradient-to-br from-gray-900 to-gray-700'
            />
            {/* Overlay gradient for better text readability */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>

            <div className='absolute bottom-4 left-0 w-full flex justify-center px-4'>
              <div className='bg-black/70 backdrop-blur-sm rounded-lg py-3 px-6 max-w-4xl'>
                <h1 className='text-white text-2xl md:text-3xl lg:text-4xl font-bold text-center'>
                  {slide.caption}
                </h1>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        className='absolute top-1/2 left-4 transform -translate-y-1/2 btn btn-circle btn-lg bg-white/20 hover:bg-white/30 border-none backdrop-blur-sm transition-all duration-300 text-white'
        onClick={prevSlide}
      >
        ❮
      </button>
      <button
        className='absolute top-1/2 right-4 transform -translate-y-1/2 btn btn-circle btn-lg bg-white/20 hover:bg-white/30 border-none backdrop-blur-sm transition-all duration-300 text-white'
        onClick={nextSlide}
      >
        ❯
      </button>
    </div>
  )
}
