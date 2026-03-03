export type TabIconKey = 'app' | 'user';

export interface AppRouteConfig {
  path: string;
  title: string;
  showInTabBar: boolean;
  tabIcon?: TabIconKey;
  // 需要登录才能访问
  requiresAuth?: boolean;
  // 仅游客可访问（已登录会被重定向）
  guestOnly?: boolean;
}

export const navigationConfig = {
  // 一键开关底部 TabBar
  enableTabBar: true,
  // 根路由和兜底路由默认跳转
  defaultRoute: '/home'
} as const;

export const appRoutes: AppRouteConfig[] = [
  {
    path: '/home',
    title: 'Home',
    showInTabBar: true,
    tabIcon: 'app'
  },
  {
    path: '/profile',
    title: 'Profile',
    showInTabBar: true,
    tabIcon: 'user',
    requiresAuth: true
  },
  {
    path: '/login',
    title: 'Login',
    showInTabBar: false,
    guestOnly: true
  }
];

export const tabBarRoutes = appRoutes.filter((route) => route.showInTabBar);
