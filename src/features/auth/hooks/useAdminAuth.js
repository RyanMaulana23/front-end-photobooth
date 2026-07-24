import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../config/axios';

/**
 * Custom Hook for Admin Login Mutation
 */
export function useAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post('/admins/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.data?.accessToken) {
        localStorage.setItem('admin_access_token', data.data.accessToken);
        queryClient.invalidateQueries({ queryKey: ['admin', 'me'] });
      }
    },
  });
}

/**
 * Custom Hook for Admin Register Mutation
 */
export function useAdminRegister() {
  return useMutation({
    mutationFn: async (userData) => {
      const response = await api.post('/admins/register', userData);
      return response.data;
    },
  });
}
