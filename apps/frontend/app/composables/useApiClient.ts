import { useAuthStore } from '../stores/auth';

export const useApiClient = () => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const strapiUrl = config.public.strapiUrl;

  const request = async <T>(path: string, options: any = {}) => {
    const headers = { ...options.headers };
    
    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`;
    }

    return $fetch<T>(`${strapiUrl}${path}`, {
      ...options,
      headers,
    });
  };

  return {
    request,
  };
};
