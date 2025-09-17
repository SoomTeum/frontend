import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAccessToken } from '@/utils/auth';
import { useAuthStore } from '@/stores/authStore';

export default function RequireAuth() {
  const storeToken = useAuthStore?.getState ? useAuthStore.getState().token : null;

  const location = useLocation();

  const accessToken = storeToken ?? getAccessToken();

  if (!accessToken) {
    sessionStorage.setItem('postLoginRedirect', location.pathname + location.search);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
