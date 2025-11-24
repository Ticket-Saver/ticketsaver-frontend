import { useState, useEffect } from 'react'
import ImageMapper from 'react-img-mapper'
import 'seatchart/dist/seatchart.min.css'

interface Area {
  shape: string
  coords: number[]
  polygon?: number[][]
  preFillColor?: string | undefined
  id?: string
  [key: string]: any
}

interface Map {
  name: string
  areas: Area[]
}

interface InteractiveMapProps {
  handleClickImageZone: (area: Area) => void
  getDefaultMap: () => Map
  src: string
  width: number
}

const InteractiveMap = ({
  handleClickImageZone,
  getDefaultMap,
  src,
  width
}: InteractiveMapProps) => {
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [updatedMap, setUpdatedMap] = useState(getDefaultMap())

  const ORIGINAL_WIDTH = 2094
  const ORIGINAL_HEIGHT = 1485

  const height = width * (ORIGINAL_HEIGHT / ORIGINAL_WIDTH)

  useEffect(() => {
    const map = { ...getDefaultMap() }
    map.areas = map.areas.map((mapArea) => {
      const newArea = { ...mapArea }

      newArea.coords = newArea.coords.map((coord, index) => {
        return index % 2 === 0
          ? (coord / ORIGINAL_WIDTH) * width // Coordenadas X
          : (coord / ORIGINAL_HEIGHT) * height // Coordenadas Y
      })

      if (newArea.polygon) {
        newArea.polygon = newArea.polygon.map((point) => {
          return point.map((coord, index) => {
            return index % 2 === 0
              ? (coord / ORIGINAL_WIDTH) * width
              : (coord / ORIGINAL_HEIGHT) * height
          })
        })
      }

      newArea.preFillColor =
        newArea.id && newArea.id === highlightedId ? 'rgba(255, 255, 0, 0.5)' : ''

      return newArea
    })

    setUpdatedMap(map)
  }, [width, height, highlightedId, getDefaultMap])

  const handleAreaClick = (area: Area) => {
    handleClickImageZone(area)
    setHighlightedId(area.id ?? null)
  }

  return (
    <ImageMapper
      src={src}
      map={updatedMap}
      width={width}
      onClick={handleAreaClick}
      stayHighlighted
      stayMultiHighlighted={false}
      toggleHighlighted
    />
  )
}

export default InteractiveMap
