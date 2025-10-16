import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleGuard = ({ requiredRole, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // No token or user - redirect to login
      if (!token || !user.role) {
        localStorage.clear();
        navigate('/login', { replace: true });
        return;
      }

      // Wrong role - force logout and redirect
      if (user.role !== requiredRole) {
        localStorage.clear();
        alert(`Access denied! Please login with ${requiredRole} account.`);
        navigate('/login', { replace: true });
        return;
      }
    };

    checkAccess();

    // Check on storage changes (multiple tabs)
    const handleStorageChange = () => checkAccess();
    window.addEventListener('storage', handleStorageChange);

    // Prevent back button after logout
    const handlePopState = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { replace: true });
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [requiredRole, navigate]);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || user.role !== requiredRole) {
    return null;
  }

  return children;
};

export default RoleGuard;