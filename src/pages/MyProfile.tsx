import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

export default function MyProfile() {
  const { user, logout, getAccessTokenSilently } = useAuth0()
  const [token, setToken] = useState('')

  const handleLogout = () => {
    logout()
  }

  useEffect(() => {
    const getToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently()
        setToken(accessToken)
        console.log(accessToken) // For debugging purposes, remove in production
      } catch (e) {
        console.error(e)
      }
    }

    getToken()
  }, [getAccessTokenSilently])

  return (
    <div className='flex flex-col gap-4'>
      <p className='text-xl font-bold'>Welcome, {user?.name || 'Guest'}!</p>
      <p className='text-gray-500'>Email: {user?.email || 'Not provided'}</p>
      <p className='text-gray-500'>Phone: {user?.phone_number || 'Not provided'}</p>
      <p className='text-gray-500'>sub id: {user?.sub || 'Guest'}</p>
      {/* Display the token for demonstration; remove or secure this in production */}
      <p className='text-gray-500'>
        Your access token: <code className='bg-gray-200 px-2 rounded-md'>{token}</code>
      </p>
    </div>
  )
}
