import { useAuthStore } from '../stores/auth';

export const useAuth = () => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const strapiUrl = config.public.strapiUrl;

  const login = async (credentials: { identifier: string; password: string }) => {
    try {
      const data = await $fetch<{ jwt: string; user: any }>(`${strapiUrl}/api/auth/local`, {
        method: 'POST',
        body: credentials,
      });

      authStore.setToken(data.jwt);
      authStore.setUser(data.user);
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.data?.error?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData: { username: string; email: string; password: string }) => {
    try {
      const data = await $fetch<{ jwt: string; user: any }>(`${strapiUrl}/api/auth/local/register`, {
        method: 'POST',
        body: userData,
      });

      authStore.setToken(data.jwt);
      authStore.setUser(data.user);
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.data?.error?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    authStore.logout();
    navigateTo('/login');
  };

  const fetchMe = async () => {
    if (!authStore.token) return;

    try {
      const user = await $fetch(`${strapiUrl}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      authStore.setUser(user);
    } catch (error) {
      authStore.logout();
    }
  };

  return {
    login,
    register,
    logout,
    fetchMe,
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
  };
};
