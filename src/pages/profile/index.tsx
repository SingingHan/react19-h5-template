import { Button, Card, List, Space, Tag } from 'antd-mobile';
import dayjs from 'dayjs';
import { useCounterStore } from '@/stores/counter';
import { useUserStore } from '@/stores/user';

function maskValue(value: string, left = 6, right = 4) {
  if (!value) {
    return '-';
  }
  if (value.length <= left + right) {
    return value;
  }
  return `${value.slice(0, left)}...${value.slice(-right)}`;
}

function ProfilePage() {
  const count = useCounterStore((state) => state.count);
  const token = useUserStore((state) => state.token);
  const refreshToken = useUserStore((state) => state.refreshToken);
  const username = useUserStore((state) => state.username);
  const mobile = useUserStore((state) => state.mobile);
  const avatar = useUserStore((state) => state.avatar);
  const setAuth = useUserStore((state) => state.setAuth);
  const setProfile = useUserStore((state) => state.setProfile);
  const clearUser = useUserStore((state) => state.clearUser);

  const handleMockLogin = () => {
    setAuth({
      token: 'demo_access_token_1234567890',
      refreshToken: 'demo_refresh_token_1234567890'
    });
    setProfile({
      username: 'Demo User',
      mobile: '13800138000',
      avatar: 'https://dummyimage.com/96x96/1677ff/ffffff&text=DU'
    });
  };

  return (
    <Space direction="vertical" block>
      <Card title="Profile">
        <div className="text-sm text-slate-700">
          <p>这是示例个人页，可放用户信息、设置和业务入口。</p>
        </div>
      </Card>

      <Card title="Runtime Info">
        <List>
          <List.Item extra={<Tag color="primary">{import.meta.env.MODE}</Tag>}>
            Current Mode
          </List.Item>
          <List.Item extra={import.meta.env.VITE_API_BASE_URL}>API Base URL</List.Item>
          <List.Item extra={String(count)}>Shared Count (from Zustand)</List.Item>
          <List.Item extra={dayjs().format('YYYY-MM-DD HH:mm:ss')}>Current Time</List.Item>
        </List>
      </Card>

      <Card title="User Store (Persist)">
        <Space direction="vertical" block>
          <List>
            <List.Item extra={username || '-'}>Username</List.Item>
            <List.Item extra={mobile || '-'}>Mobile</List.Item>
            <List.Item extra={maskValue(token)}>Token</List.Item>
            <List.Item extra={maskValue(refreshToken)}>Refresh Token</List.Item>
            <List.Item
              extra={
                avatar ? (
                  <img src={avatar} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  '-'
                )
              }
            >
              Avatar
            </List.Item>
          </List>

          <Space block>
            <Button color="primary" onClick={handleMockLogin}>
              Mock Set User
            </Button>
            <Button color="danger" fill="outline" onClick={clearUser}>
              Clear User
            </Button>
          </Space>
        </Space>
      </Card>
    </Space>
  );
}

export default ProfilePage;
