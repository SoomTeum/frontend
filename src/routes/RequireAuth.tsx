import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useIsAuthed } from '@/stores/authStore';

export default function RequireAuth() {
  const authed = useIsAuthed();
  const location = useLocation();

  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
