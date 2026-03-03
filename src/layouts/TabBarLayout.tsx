import { AppOutline, UserOutline } from 'antd-mobile-icons';
import { TabBar } from 'antd-mobile';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { tabBarRoutes } from '@/config/navigation';

const iconMap = {
  app: <AppOutline />,
  user: <UserOutline />
} as const;

const tabs = tabBarRoutes.map((route) => ({
  key: route.path,
  title: route.title,
  icon: route.tabIcon ? iconMap[route.tabIcon] : null
}));

function TabBarLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeKey = tabs.find((tab) => location.pathname.startsWith(tab.key))?.key ?? tabs[0]?.key;

  return (
    <main className="mx-auto min-h-[100dvh] max-w-xl bg-slate-50">
      <div className="min-h-[100dvh] px-4 pb-[calc(4rem+env(safe-area-inset-bottom))] pt-4">
        <Outlet />
      </div>

      <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-xl border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]">
        <TabBar activeKey={activeKey} onChange={(key) => navigate(key)}>
          {tabs.map((item) => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </div>
    </main>
  );
}

export default TabBarLayout;
