import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const ProtectedPage = () => {
  const { user, logout } = useAuth0();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return(
    <div>
      <p>Welcome, {user?.name || 'Guest'}!</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  )
};

export default ProtectedPage;