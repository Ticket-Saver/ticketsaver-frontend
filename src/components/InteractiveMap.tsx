<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> b5e4382e2d1ea914a5314e73e21c56f1308a43b2
import ImageMapper from 'react-img-mapper';

import 'seatchart/dist/seatchart.min.css';
interface InteractiveMapProps {
  handleClickImageZone: (area: any) => void;
  getDefaultMap: any;
  src: string
  width: number
}

const InteractiveMap = ({handleClickImageZone, getDefaultMap, src, width}:InteractiveMapProps) => {
  const [highlightedAreas, setHighlightedAreas] = useState([]);
  const [updatedMap, setUpdatedMap] = useState(getDefaultMap());
  const height = width;

  useEffect(() => {
    const map = {...getDefaultMap()};
    map.areas = map.areas.map((mapArea: any) => {
      const newArea = {...mapArea};
      newArea.coords = newArea.coords.map((coord: number, index: number) => {
        return index % 2 === 0 ? (coord / 1328) * width : (coord / 1328) * height;
      });
  
      if (newArea.polygon) {
        newArea.polygon = newArea.polygon.map((point: number[]) => {
          return point.map((coord: number, index: number) => {
            return index % 2 === 0 ? (coord / 1328) * width : (coord / 1328) * height;
          });
        });
      }
  
      if (highlightedAreas.some(highlightedArea => JSON.stringify(highlightedArea.coords) === JSON.stringify(newArea.coords))) {
        newArea.preFillColor = 'rgba(255, 255, 0, 0.5)';
      } else {
        newArea.preFillColor = null;
      }
      return newArea;
    });
    setUpdatedMap(map);
  }, [highlightedAreas, width, height]);

  const handleAreaClick = (area: any) => {
    handleClickImageZone(area);
    setHighlightedAreas([area]);
  };

  return (
    <div className="flex-row overflow-visible justify-center content-center ">
      <div className="justify-center content-center items-center overline mt-4 cursor-pointer">
        <ImageMapper
          src={src}
          map={updatedMap}
          width={width}
          height={height}
          onClick={handleAreaClick}
          stayHighlighted={true}
          stayMultiHighlighted={false}
          toggleHighlighted={true}
        />
      </div>
    </div>
  );
};

export default InteractiveMap;
