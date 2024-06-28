import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'
import TicketIcon from '../assets/icons/ticket.svg'
import ProfileIcon from '../assets/icons/profile.svg'
import SettingsIcon from '../assets/icons/settings.svg'
import HelpIcon from '../assets/icons/help.svg'
import WalletIcon from '../assets/icons/wallet.svg'

export default function Sidebar() {
  const { isAuthenticated, user } = useAuth0()

  return (
    <div className='bg-[#180F3C] bg-opacity-4 text-white w-80 min-h-screen p-4'>
      <div className='flex flex-col items-center py-8'>
        <img
          src={isAuthenticated && user?.picture ? user?.picture : '/user.png'}
          alt='Profile'
          className='w-40 h-40 rounded-full mb-4'
        />
        <h2 className='text-md mb-4'>{user?.name}</h2>
      </div>
      <nav className='flex flex-col space-y-5 px-4'>
        <Link
          to='/dashboard/profile'
          className='p-2 px-5 rounded-xl flex items-center text-white bg-[#1A0F40] hover:bg-[#221551] focus:bg-[#221551]'
        >
          <img src={ProfileIcon} alt='Profile Icon' className='h-6 w-6 text-white mr-2' />
          My Profile
        </Link>
        <Link
          to='/dashboard/tickets'
          className='p-2 px-5 rounded-xl flex items-center bg-[#1A0F40] text-white hover:bg-[#221551] focus:bg-[#221551]'
        >
          <img src={TicketIcon} alt='Ticket Icon' className='h-6 w-6 text-white mr-2' />
          My Tickets
        </Link>
        <Link
          to='/dashboard/settings'
          className='p-2 px-5 rounded-xl flex items-center text-white bg-[#1A0F40] hover:bg-[#221551] focus:bg-[#221551]'
        >
          <img src={SettingsIcon} alt='Settings Icon' className='h-6 w-6 text-white mr-2' />
          Settings
        </Link>
        <Link
          to='/dashboard/web3'
          className='p-2 px-5 rounded-xl flex items-center text-white bg-[#1A0F40] hover:bg-[#221551] focus:bg-[#221551]'
        >
          <img src={WalletIcon} alt='Settings Icon' className='h-6 w-6 text-white mr-2' />
          Web3
        </Link>
        <Link
          to='/dashboard/help'
          className='p-2 px-5 rounded-xl flex items-center text-white bg-[#1A0F40] hover:bg-[#221551] focus:bg-[#221551]'
        >
          <img src={HelpIcon} alt='Help Icon' className='h-6 w-6 text-white mr-2' />
          You need help?
        </Link>
      </nav>
    </div>
  )
}
