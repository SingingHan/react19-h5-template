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
    <main className="app-shell">
      <div className="page-shell">
        <Outlet />
      </div>

      <div className="tabbar-shell border-t border-slate-200 bg-white">
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
