import { Button, ErrorBlock, Space } from 'antd-mobile';

interface PageErrorProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

function PageError({ title = '加载失败', description = '请稍后重试', onRetry }: PageErrorProps) {
  return (
    <Space direction="vertical" block className="py-4">
      <ErrorBlock status="disconnected" title={title} description={description} />
      {onRetry ? (
        <Button block color="primary" fill="outline" onClick={onRetry}>
          重新加载
        </Button>
      ) : null}
    </Space>
  );
}

export default PageError;
