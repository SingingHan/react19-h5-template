import { describe, expect, it } from 'vitest';
import { getAccessToken, useUserStore } from './user';

describe('useUserStore', () => {
  it('updates auth and profile fields', () => {
    useUserStore.getState().setAuth({ token: 't-1', refreshToken: 'r-1' });
    useUserStore.getState().setProfile({
      username: 'Alice',
      mobile: '13800000000',
      avatar: 'https://example.com/avatar.png'
    });

    const state = useUserStore.getState();

    expect(state.token).toBe('t-1');
    expect(state.refreshToken).toBe('r-1');
    expect(state.username).toBe('Alice');
    expect(state.mobile).toBe('13800000000');
    expect(state.avatar).toContain('avatar.png');
    expect(getAccessToken()).toBe('t-1');
  });

  it('clears all user fields', () => {
    useUserStore.getState().setAuth({ token: 't-1', refreshToken: 'r-1' });
    useUserStore.getState().setProfile({ username: 'Alice', mobile: '13800000000' });

    useUserStore.getState().clearUser();

    const state = useUserStore.getState();

    expect(state.token).toBe('');
    expect(state.refreshToken).toBe('');
    expect(state.username).toBe('');
    expect(state.mobile).toBe('');
    expect(state.avatar).toBe('');
  });
});
