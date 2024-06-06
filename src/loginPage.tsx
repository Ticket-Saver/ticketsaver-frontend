import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const LoginPage = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await loginWithRedirect();
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/protected');
    }
  }, [isAuthenticated, navigate]);

  return(
    <div>
       <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default LoginPage;