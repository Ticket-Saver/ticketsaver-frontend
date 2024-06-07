import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import LoginPage from './loginPage';
import ProtectedPage from './protectedPage';

const ProtectedRoute = ({ element }: { element: ReactNode }) => {
  const { isAuthenticated } = useAuth0();
  return isAuthenticated ? element : <Navigate to="/" />;
};

export const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/protected" element={ <ProtectedRoute element={<ProtectedPage />} />}
      />
    </Routes>
  </Router>
);