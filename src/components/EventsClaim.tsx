import { Link } from "react-router-dom"

export interface EventsClaimConfig {
  eventId: string
  id: string
  title: string
  description: string
  thumbnailURL: string
  date: string
  color?: string
  fontColor?: string
  venue?: string
  city?: string
  route?: string
}

export default function EveClaim({ title, city, thumbnailURL, route = "" }: EventsClaimConfig) {
  console.log(route)
  return (
    <div className='w-full bg-neutral rounded-xl flex flex-col sm:flex-row'>
  <div className='flex flex-col justify-between p-4 py-6 w-full sm:w-2/5'>
    <div className='text-xl sm:text-3xl font-semibold'>{title}</div>
    <div className='w-full h-[1px] bg-gradient-to-r from-[#E779C1] to-[#221551] my-4'></div>
    <div className='text-lg sm:text-xl pb-4'>{city}</div>
    <div className='text-sm pb-10'>
      You have a collectible ticket to claim! Connect your wallet now to secure it
    </div>
    <Link to={route}>
      <button className='btn btn-primary btn-outline px-4 sm:px-10'>View your tickets</button>
    </Link>
  </div>
  <div className='w-full sm:w-3/5 flex justify-center items-center p-4'>
    <img
      src={thumbnailURL}
      alt='Event Image'
      className='w-full h-auto sm:h-full object-cover rounded-xl'
    />
  </div>
</div>
  )
}
