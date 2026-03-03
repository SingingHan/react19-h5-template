# 项目描述文件

## 1. 项目定位

这是一个面向移动端 H5 的基础模板，目标是让业务项目在最短时间内具备：

- 可维护的路由与权限结构
- 可扩展的请求层和用户态管理
- 可落地的工程规范与测试入口

适用于中后台移动端、活动页容器应用、需要快速迭代的业务 H5 项目。

## 2. 当前能力边界

已具备：

- 页面基础框架（Home / Profile / Login）
- TabBar 可配置开关
- 用户态持久化
- 请求自动带 token / 401 刷新 / 幂等重试 / 去重取消
- 页面三态组件（加载中、空态、错误）

不包含（需按业务补充）：

- 真实登录流程与接口联调
- 多角色权限模型
- 埋点体系与监控上报
- 国际化与主题系统

## 3. 关键配置入口

- 路由配置：`src/config/navigation.ts`
- 后端协议配置：`src/config/integration.ts`
- 环境配置：`.env.*`

推荐原则：

- 配置集中，不在业务页面散落常量
- 协议变更优先改 `integration.ts`
- 环境差异优先改 `.env.*`

## 4. 开发约定

- 页面请求通过 `src/lib/http/request.ts` 发起
- 页面级状态优先 `zustand`，服务端缓存优先 `tanstack-query`
- 共享 UI 状态优先复用 `components/page-state`
- 新增受保护页面时，在路由配置写 `requiresAuth: true`

## 5. 建议的下一步增强

- 接入真实登录、退出、刷新失败后的统一跳转
- 增加业务错误码到文案的映射层
- 为关键 store、hooks 增加更多单测
- 引入监控（错误、性能、接口耗时）

## 6. 交接说明

新同学先看：

1. `README.md`（如何运行）
2. `src/config/integration.ts`（后端对接关键项）
3. `src/config/navigation.ts`（路由与权限）
4. `src/lib/http/client.ts`（请求链路）
