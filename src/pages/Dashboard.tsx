import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

export default function Dashbord() {
  return (
    <div className='bg-[#130B30] flex '>
      <div>
        <Sidebar />
      </div>
      <div className='flex-grow'>
        <Outlet />
      </div>
    </div>
  )
}
