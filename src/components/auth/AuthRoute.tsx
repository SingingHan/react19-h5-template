import type { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { navigationConfig } from '@/config/navigation';
import { useUserStore } from '@/stores/user';

interface AuthRouteProps {
  children: ReactElement;
  requiresAuth?: boolean;
  guestOnly?: boolean;
}

function AuthRoute({ children, requiresAuth, guestOnly }: AuthRouteProps) {
  const token = useUserStore((state) => state.token);
  const location = useLocation();

  if (requiresAuth && !token) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  if (guestOnly && token) {
    return <Navigate to={navigationConfig.defaultRoute} replace />;
  }

  return children;
}

export default AuthRoute;
