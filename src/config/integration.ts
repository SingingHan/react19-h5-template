/**
 * 对接后端时，优先看这里（常改 5 项）
 */
export const integrationConfig = {
  // 1) 后端业务成功码（默认约定 code === 0）
  successCode: 0,
  // 2) token 请求头字段名
  tokenHeaderKey: 'Authorization',
  // 3) token 前缀（常见 Bearer）
  tokenPrefix: 'Bearer ',
  // 4) refresh 接口请求体里的字段名
  refreshTokenField: 'refreshToken',
  // 5) 用户信息持久化 storage key
  userStoreKey: 'h5-user-store'
} as const;
