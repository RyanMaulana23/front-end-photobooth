import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../config/axios';

/**
 * Fetch profile data of currently logged in admin
 */
export function useAdminProfile() {
  return useQuery({
    queryKey: ['admin', 'me'],
    queryFn: async () => {
      const response = await api.get('/admins/me');
      return response.data?.data || null;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

/**
 * Fetch all photo sessions with customer and photo details
 */
export function useAdminSessions() {
  return useQuery({
    queryKey: ['admin', 'sessions'],
    queryFn: async () => {
      const response = await api.get('/admins/sessions');
      return response.data?.data || [];
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Fetch all customers with optional email filter
 */
export function useAdminCustomers(email = '') {
  return useQuery({
    queryKey: ['admin', 'customers', email],
    queryFn: async () => {
      const params = email ? { email } : {};
      const response = await api.get('/admins/customers', { params });
      return response.data?.data || [];
    },
    staleTime: 1000 * 30,
  });
}

/**
 * Admin Logout Mutation
 */
export function useAdminLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete('/admins/logout');
      return response.data;
    },
    onSettled: () => {
      localStorage.removeItem('admin_access_token');
      queryClient.clear();
    },
  });
}
