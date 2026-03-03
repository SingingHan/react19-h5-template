import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ConfigProvider, unstableSetRender } from 'antd-mobile';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { queryClient } from '@/lib/query/queryClient';
import 'antd-mobile/es/global';
import './index.css';

const mobileContainerRootMap = new WeakMap<Element | DocumentFragment, Root>();

unstableSetRender((node, container) => {
  let root = mobileContainerRootMap.get(container);

  if (!root) {
    root = createRoot(container);
    mobileContainerRootMap.set(container, root);
  }

  root.render(node);

  return async () => {
    await Promise.resolve();
    root.unmount();
    mobileContainerRootMap.delete(container);
  };
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ConfigProvider>
  </React.StrictMode>
);
