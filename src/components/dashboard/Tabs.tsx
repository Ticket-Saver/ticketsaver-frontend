import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Tab {
  id: string
  title: string
  path: string
}

export default function Tabs() {
  const [activeTab, setActiveTab] = useState('tab1')
  const navigate = useNavigate()

  const tabs = [
    { id: 'tab1', title: 'See upcoming event', path: 'upcomingevent' },
    { id: 'tab2', title: 'View on past event', path: 'pastevent' },
    { id: 'tab3', title: 'My collectibles', path: 'collectibles' }
  ]

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab.id)
    navigate(`/dashboard/tickets/${tab.path}`)
  }

  return (
    <div className='w-full h-36 bg-neutral rounded-xl flex flex-col justify-between p-4 py-6'>
      <div className='text-3xl font-semibold'>My tickets</div>
      <div className='w-2/5 h-[1px] bg-gradient-to-r from-[#E779C1] to-[#221551]'></div>
      <div>
        <ul className='flex space-x-14'>
          {tabs.map((tab) => (
            <li
              key={tab.id}
              className={`cursor-pointer ${activeTab === tab.id ? 'border-b-[1px] border-white' : 'text-white'}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
