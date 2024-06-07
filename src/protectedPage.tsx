import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const ProtectedPage = () => {
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState('');

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const getToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        setToken(accessToken);
        console.log(accessToken); // For debugging purposes, remove in production
      } catch (e) {
        console.error(e);
      }
    };

    getToken();
  }, [getAccessTokenSilently]);

  return (
    <div>
      <p>Welcome, {user?.name || 'Guest'}!</p>
      <p>Email: {user?.email || 'Not provided'}</p>
      <p>sub id: {user?.sub || 'Guest'}</p>
      {/* Display the token for demonstration; remove or secure this in production */}
      <p>Your access token: <code>{token}</code></p>

      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default ProtectedPage;