import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

const getAccessToken = () => {
  const t = localStorage.getItem('accessToken');
  return t && t !== 'null' && t !== 'undefined' ? t : null;
};

export default function RequireAuth() {
  const { token, hasHydrated } = useAuthStore((s) => ({
    token: s.token,
    hasHydrated: s.hasHydrated,
  }));
  const location = useLocation();

  if (!hasHydrated) return null;

  const accessToken = token ?? getAccessToken();
  if (!accessToken) {
    const target = location.pathname + location.search + location.hash;
    sessionStorage.setItem('postLoginRedirect', target);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
