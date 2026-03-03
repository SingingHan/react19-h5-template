import { HttpResponse, http } from 'msw';

export const handlers = [
  http.get('/system/info', () => {
    return HttpResponse.json({
      code: 0,
      message: 'ok',
      data: {
        env: 'mock',
        time: '2026-01-01 00:00:00'
      }
    });
  }),
  http.post('/auth/refresh', async () => {
    return HttpResponse.json({
      code: 0,
      message: 'ok',
      data: {
        token: 'new_access_token',
        refreshToken: 'new_refresh_token'
      }
    });
  })
];
