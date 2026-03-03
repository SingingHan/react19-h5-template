# React H5 Template

一个可直接落地业务的 H5 前端模板，内置路由、状态管理、请求封装、用户态持久化、基础工程规范和测试底座。

## 技术栈

- React + TypeScript + Vite
- React Router
- Zustand（含 persist）
- Tailwind CSS
- Ant Design Mobile
- Axios + TanStack Query
- Vitest + Testing Library + MSW

## 快速开始

```bash
pnpm install
pnpm dev
```

## 环境变量

- `.env`：公共默认配置
- `.env.development`：开发环境
- `.env.test`：测试环境
- `.env.production`：生产环境
- `.env.example`：示例配置

核心变量：

- `VITE_API_BASE_URL`：接口基础地址
- `VITE_API_TIMEOUT`：请求超时（ms）
- `VITE_API_RETRY`：幂等请求重试次数
- `VITE_API_RETRY_DELAY`：重试间隔基数（ms）
- `VITE_API_REFRESH_PATH`：刷新 token 接口路径

## 常用命令

```bash
pnpm dev
pnpm dev:test
pnpm build:dev
pnpm build:test
pnpm build:prod
pnpm preview
pnpm typecheck
pnpm lint
pnpm stylelint
pnpm test:run
```

## 目录结构

```text
src
├─ App.tsx                       # 路由入口
├─ config
│  ├─ integration.ts             # 后端对接常改 5 项
│  └─ navigation.ts              # 路由与 TabBar 配置
├─ components
│  ├─ auth/AuthRoute.tsx         # 路由守卫
│  └─ page-state/*               # 页面三态组件
├─ layouts/TabBarLayout.tsx      # 底部 TabBar 布局
├─ lib/http
│  ├─ client.ts                  # axios 实例与拦截器
│  ├─ request.ts                 # get/post/put/delete
│  └─ types.ts                   # 请求扩展类型
├─ pages
│  ├─ home
│  ├─ profile
│  └─ login
├─ stores
│  ├─ counter.ts
│  └─ user.ts                    # 用户态持久化
└─ test                           # vitest + msw
```

## 路由与权限

路由配置在 `src/config/navigation.ts`：

- `enableTabBar`：是否启用底部 TabBar
- `defaultRoute`：默认跳转路由
- `requiresAuth`：需要登录
- `guestOnly`：仅游客可访问（已登录会重定向）

## 请求层说明

请求封装在 `src/lib/http/client.ts`，支持：

- 统一错误处理
- `{ code, message, data }` 自动解包
- GET 请求默认去重（重复请求取消）
- 幂等请求自动重试
- 401 自动刷新 token（并发请求排队重放）

后端协议常改项统一在 `src/config/integration.ts`：

- 成功码 `successCode`
- token 请求头名 `tokenHeaderKey`
- token 前缀 `tokenPrefix`
- refresh 参数字段 `refreshTokenField`
- 用户存储 key `userStoreKey`

## 状态管理

`src/stores/user.ts` 持久化字段：

- `token`
- `refreshToken`
- `username`
- `mobile`
- `avatar`

## H5 适配

- 使用 `100dvh`
- 支持 `safe-area-inset-bottom`
- TabBar 底部安全区处理

## 规范与测试

- 代码规范：ESLint + Prettier + Stylelint
- 提交流程：Husky + lint-staged + commitlint
- 测试底座：Vitest + Testing Library + MSW

## 补充文档

项目说明（定位、约定、扩展建议）见：`PROJECT.md`
