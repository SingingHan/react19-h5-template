import { useMemo, useState } from 'react';
import { Button, Card, Input, Space, Toast } from 'antd-mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { navigationConfig } from '@/config/navigation';
import { useUserStore } from '@/stores/user';

function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useUserStore((state) => state.setAuth);
  const setProfile = useUserStore((state) => state.setProfile);

  const [mobile, setMobile] = useState('13800138000');
  const [username, setUsername] = useState('Demo User');

  const redirectPath = useMemo(
    () => searchParams.get('redirect') || navigationConfig.defaultRoute,
    [searchParams]
  );

  const handleLogin = () => {
    if (!mobile.trim()) {
      Toast.show({ icon: 'fail', content: '请输入手机号' });
      return;
    }

    setAuth({
      token: `token_${Date.now()}`,
      refreshToken: `refresh_${Date.now()}`
    });

    setProfile({
      mobile,
      username,
      avatar: `https://dummyimage.com/96x96/1677ff/ffffff&text=${encodeURIComponent(
        username.slice(0, 2) || 'U'
      )}`
    });

    Toast.show({ icon: 'success', content: '登录成功' });
    navigate(redirectPath, { replace: true });
  };

  return (
    <main className="app-shell page-shell-standalone">
      <Card title="Login">
        <Space direction="vertical" block>
          <Input
            placeholder="请输入用户名"
            value={username}
            onChange={setUsername}
            clearable
          />
          <Input
            placeholder="请输入手机号"
            value={mobile}
            onChange={setMobile}
            clearable
          />
          <Button color="primary" block onClick={handleLogin}>
            登录
          </Button>
        </Space>
      </Card>
    </main>
  );
}

export default LoginPage;
