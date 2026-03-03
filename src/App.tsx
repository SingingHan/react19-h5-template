import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { ReactElement } from 'react';
import { appRoutes, navigationConfig } from '@/config/navigation';
import AuthRoute from '@/components/auth/AuthRoute';
import TabBarLayout from '@/layouts/TabBarLayout';
import HomePage from '@/pages/home';
import LoginPage from '@/pages/login';
import ProfilePage from '@/pages/profile';

const routeElementMap = {
  '/home': <HomePage />,
  '/profile': <ProfilePage />,
  '/login': <LoginPage />
} as const;

function App() {
  const shouldUseTabBar = navigationConfig.enableTabBar;

  const createRoute = (path: string) => {
    const route = appRoutes.find((item) => item.path === path);
    const element = routeElementMap[path as keyof typeof routeElementMap];

    if (!route || !element) {
      return null;
    }

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <AuthRoute requiresAuth={route.requiresAuth} guestOnly={route.guestOnly}>
            {element}
          </AuthRoute>
        }
      />
    );
  };

  const tabBarRoutes = appRoutes
    .filter((route) => route.showInTabBar)
    .map((route) => createRoute(route.path))
    .filter(Boolean) as ReactElement[];
  const standaloneRoutes = appRoutes
    .filter((route) => !route.showInTabBar)
    .map((route) => createRoute(route.path))
    .filter(Boolean) as ReactElement[];

  return (
    <BrowserRouter>
      <Routes>
        {shouldUseTabBar && tabBarRoutes.length > 0 ? (
          <Route element={<TabBarLayout />}>{tabBarRoutes}</Route>
        ) : (
          tabBarRoutes
        )}
        {standaloneRoutes}
        <Route path="/" element={<Navigate to={navigationConfig.defaultRoute} replace />} />
        <Route path="*" element={<Navigate to={navigationConfig.defaultRoute} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
