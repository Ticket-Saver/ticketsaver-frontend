// copernicusMap.ts
import { buildAreasFromSections } from './Helper'
import { COPERNICUS_SECTIONS } from './sections'

const getDefaultMap = () => ({
  name: 'copernicus_center_il',
  areas: buildAreasFromSections(COPERNICUS_SECTIONS)
})

export default getDefaultMap
