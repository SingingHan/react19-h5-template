import { Empty } from 'antd-mobile';

interface PageEmptyProps {
  description?: string;
}

function PageEmpty({ description = '暂无数据' }: PageEmptyProps) {
  return (
    <div className="py-4">
      <Empty description={description} />
    </div>
  );
}

export default PageEmpty;
