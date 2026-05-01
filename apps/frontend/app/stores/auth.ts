import { defineStore } from 'pinia';
import type { User } from '~/types/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  });

  const isAuthenticated = computed(() => !!token.value);

  function setToken(newToken: string | null) {
    token.value = newToken;
  }

  function setUser(newUser: User | null) {
    user.value = newUser;
  }

  function logout() {
    token.value = null;
    user.value = null;
  }

  return {
    user,
    token,
    isAuthenticated,
    setToken,
    setUser,
    logout,
  };
});
