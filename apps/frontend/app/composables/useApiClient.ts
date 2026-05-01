import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack';
import { useAuthStore } from '~/stores/auth';

export const useApiClient = () => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const strapiUrl = config.public.strapiUrl;

  const request = async <T>(
    path: string,
    options: NitroFetchOptions<NitroFetchRequest> = {},
  ) => {
    const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };

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
