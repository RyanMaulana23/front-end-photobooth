import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import api from '../../../config/axios';
import { supabase } from '../../../config/supabase';

/**
 * Native Supabase Realtime WebSocket Subscription hook.
 * Listens to postgres_changes on photo_sessions, customers, and photos tables simultaneously.
 */
export function useAdminRealtimeSubscription() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('admin-dashboard-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'photo_sessions' },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload;
          queryClient.setQueryData(['admin', 'sessions'], (oldSessions = []) => {
            if (eventType === 'INSERT' && newRow?.id) {
              const exists = oldSessions.some(
                (s) => (s.photoSession?.id || s.id) === newRow.id,
              );
              if (exists) return oldSessions;
              const newSessionItem = {
                photoSession: newRow,
                customer: null,
                photos: [],
              };
              return [newSessionItem, ...oldSessions];
            }
            if (eventType === 'UPDATE' && newRow?.id) {
              return oldSessions.map((s) => {
                const sId = s.photoSession?.id || s.id;
                if (sId === newRow.id) {
                  return {
                    ...s,
                    photoSession: { ...(s.photoSession || s), ...newRow },
                  };
                }
                return s;
              });
            }
            if (eventType === 'DELETE' && oldRow?.id) {
              return oldSessions.filter(
                (s) => (s.photoSession?.id || s.id) !== oldRow.id,
              );
            }
            return oldSessions;
          });
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customers' },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload;
          // Update customers table cache
          queryClient.setQueryData(
            ['admin', 'customers', ''],
            (oldCustomers = []) => {
              if (eventType === 'INSERT' && newRow?.id) {
                return [newRow, ...oldCustomers];
              }
              if (eventType === 'UPDATE' && newRow?.id) {
                return oldCustomers.map((c) =>
                  c.id === newRow.id ? newRow : c,
                );
              }
              if (eventType === 'DELETE' && oldRow?.id) {
                return oldCustomers.filter((c) => c.id !== oldRow.id);
              }
              return oldCustomers;
            },
          );
          // Embed customer into matching photo session
          if (newRow) {
            const targetSessionId =
              newRow.sessionId || newRow.session_id || newRow.photoSessionId;
            queryClient.setQueryData(
              ['admin', 'sessions'],
              (oldSessions = []) => {
                return oldSessions.map((s) => {
                  const sId = s.photoSession?.id || s.id;
                  if (
                    targetSessionId &&
                    sId &&
                    String(sId).toLowerCase() ===
                      String(targetSessionId).toLowerCase()
                  ) {
                    return { ...s, customer: newRow };
                  }
                  return s;
                });
              },
            );
          }
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'photos' },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload;
          const targetSessionId =
            newRow?.sessionId ||
            newRow?.session_id ||
            newRow?.folderName ||
            oldRow?.sessionId ||
            oldRow?.session_id;

          if (targetSessionId) {
            queryClient.setQueryData(
              ['admin', 'sessions'],
              (oldSessions = []) => {
                return oldSessions.map((s) => {
                  const sId = s.photoSession?.id || s.id;
                  if (
                    sId &&
                    String(sId).toLowerCase() ===
                      String(targetSessionId).toLowerCase()
                  ) {
                    const currentPhotos = s.photos || [];
                    if (eventType === 'INSERT' && newRow?.id) {
                      const photoExists = currentPhotos.some(
                        (p) => p.id === newRow.id,
                      );
                      if (photoExists) return s;
                      return { ...s, photos: [...currentPhotos, newRow] };
                    }
                    if (eventType === 'UPDATE' && newRow?.id) {
                      return {
                        ...s,
                        photos: currentPhotos.map((p) =>
                          p.id === newRow.id ? newRow : p,
                        ),
                      };
                    }
                    if (eventType === 'DELETE' && oldRow?.id) {
                      return {
                        ...s,
                        photos: currentPhotos.filter((p) => p.id !== oldRow.id),
                      };
                    }
                  }
                  return s;
                });
              },
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

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
 * Fetch all photo sessions with customer and photo details (Supabase Realtime Driven)
 */
export function useAdminSessions() {
  return useQuery({
    queryKey: ['admin', 'sessions'],
    queryFn: async () => {
      const response = await api.get('/admins/sessions');
      return response.data?.data || [];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
}

/**
 * Fetch all customers with optional email filter (Supabase Realtime Driven)
 */
export function useAdminCustomers(email = '') {
  return useQuery({
    queryKey: ['admin', 'customers', email],
    queryFn: async () => {
      const params = email ? { email } : {};
      const response = await api.get('/admins/customers', { params });
      return response.data?.data || [];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
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
