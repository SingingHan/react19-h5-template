import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd-mobile';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { queryClient } from '@/lib/query/queryClient';
import 'antd-mobile/es/global';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ConfigProvider>
  </React.StrictMode>
);
