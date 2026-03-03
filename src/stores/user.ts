import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { integrationConfig } from '@/config/integration';

export interface UserProfile {
  username: string;
  mobile: string;
  avatar: string;
}

interface UserState extends UserProfile {
  token: string;
  refreshToken: string;
  setAuth: (payload: { token: string; refreshToken?: string }) => void;
  setProfile: (payload: Partial<UserProfile>) => void;
  clearUser: () => void;
}

const initialState: Pick<UserState, 'token' | 'refreshToken' | keyof UserProfile> = {
  token: '',
  refreshToken: '',
  username: '',
  mobile: '',
  avatar: ''
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: ({ token, refreshToken }) =>
        set((state) => ({
          token,
          refreshToken: refreshToken ?? state.refreshToken
        })),
      setProfile: (payload) => set(payload),
      clearUser: () => set(initialState)
    }),
    {
      name: integrationConfig.userStoreKey,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        username: state.username,
        mobile: state.mobile,
        avatar: state.avatar
      })
    }
  )
);

export function getAccessToken() {
  return useUserStore.getState().token;
}

export function getRefreshToken() {
  return useUserStore.getState().refreshToken;
}
