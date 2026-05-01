import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  });

  const isAuthenticated = computed(() => !!token.value);

  function setToken(newToken: string | null) {
    token.value = newToken;
  }

  function setUser(newUser: any) {
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
