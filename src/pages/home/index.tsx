import { useMemo, useState } from 'react';
import { Button, Card, List, Space, Toast } from 'antd-mobile';
import { PageEmpty, PageError, PageLoading } from '@/components/page-state';
import dayjs from 'dayjs';
import { useServerInfoQuery } from '@/hooks/useServerInfoQuery';
import { type ServerInfo, getServerInfoSimple } from '@/services/demo';
import { useCounterStore } from '@/stores/counter';
import { toLabel } from '@/utils/format';

function HomePage() {
  const modeLabel = useMemo(() => toLabel(import.meta.env.MODE), []);
  const now = useMemo(() => dayjs().format('YYYY-MM-DD HH:mm:ss'), []);

  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

  const query = useServerInfoQuery();
  const [simpleData, setSimpleData] = useState<ServerInfo | null>(null);

  const serverInfo = query.data || simpleData;

  const handleSimpleRequest = async () => {
    try {
      const data = await getServerInfoSimple();
      setSimpleData(data);
      Toast.show({
        icon: 'success',
        content: `Simple request success: ${data.env}`
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request failed';
      Toast.show({
        icon: 'fail',
        content: message
      });
    }
  };

  const handleQueryRequest = async () => {
    const result = await query.refetch();
    if (result.error) {
      const message = result.error instanceof Error ? result.error.message : 'Query failed';
      Toast.show({ icon: 'fail', content: message });
      return;
    }

    Toast.show({
      icon: 'success',
      content: `Query success: ${result.data?.env || 'ok'}`
    });
  };

  const renderServerState = () => {
    if (query.isFetching) {
      return <PageLoading text="请求数据中..." />;
    }

    if (query.isError) {
      return (
        <PageError
          description={query.error instanceof Error ? query.error.message : '请求失败'}
          onRetry={handleQueryRequest}
        />
      );
    }

    if (!serverInfo) {
      return <PageEmpty description="点击上方按钮加载服务端信息" />;
    }

    return (
      <List>
        <List.Item extra={serverInfo.env}>Env</List.Item>
        <List.Item extra={serverInfo.time}>Server Time</List.Item>
      </List>
    );
  };

  return (
    <Space direction="vertical" block>
      <Card title="Home">
        <div className="space-y-2 text-sm text-slate-700">
          <p>Mode: {modeLabel}</p>
          <p>Base URL: {import.meta.env.VITE_API_BASE_URL}</p>
          <p>Rendered At: {now}</p>
        </div>
      </Card>

      <Card title="Zustand Example">
        <div className="mb-3 text-base font-medium">Count: {count}</div>
        <Space wrap>
          <Button color="primary" onClick={increment}>
            +1
          </Button>
          <Button color="default" onClick={decrement}>
            -1
          </Button>
          <Button color="warning" onClick={reset}>
            reset
          </Button>
        </Space>
      </Card>

      <Card title="Request Examples">
        <Space direction="vertical" block>
          <Button color="primary" block onClick={handleSimpleRequest}>
            Axios simple request
          </Button>
          <Button color="success" block onClick={handleQueryRequest}>
            TanStack Query request
          </Button>
        </Space>
        <div className="mt-3">{renderServerState()}</div>
      </Card>
    </Space>
  );
}

export default HomePage;
