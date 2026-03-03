import { DotLoading } from 'antd-mobile';

interface PageLoadingProps {
  text?: string;
}

function PageLoading({ text = '加载中...' }: PageLoadingProps) {
  return (
    <div className="flex min-h-24 items-center justify-center text-sm text-slate-500">
      <DotLoading />
      <span className="ml-2">{text}</span>
    </div>
  );
}

export default PageLoading;
