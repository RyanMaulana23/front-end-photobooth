import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import api from '../../../config/axios';
import { supabase } from '../../../config/supabase';
import {
  saveSessionTriggerTime,
  resolveSessionTimestamp,
} from '../../../utils/dateHelper';

/**
 * Native Supabase Realtime WebSocket Subscription hook.
 * Listens to postgres_changes on photo_sessions, customers, and photos tables simultaneously.
 */
export function useAdminRealtimeSubscription() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Listen for realtime photobooth trigger events from the same browser / tabs
    const handleLocalTrigger = (e) => {
      const { sessionId, timestamp } = e.detail || {};
      if (sessionId && timestamp) {
        queryClient.setQueryData(['admin', 'sessions'], (oldSessions = []) => {
          return oldSessions.map((s) => {
            const sId = s.photoSession?.id || s.id;
            if (
              sId &&
              String(sId).toLowerCase() === String(sessionId).toLowerCase()
            ) {
              return {
                ...s,
                photoSession: {
                  ...(s.photoSession || s),
                  createdAt: timestamp,
                  created_at: timestamp,
                },
                createdAt: timestamp,
                created_at: timestamp,
              };
            }
            return s;
          });
        });
      }
    };
    window.addEventListener('dsc_session_timestamp_updated', handleLocalTrigger);

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
              const triggerTime =
                newRow.createdAt ||
                newRow.created_at ||
                saveSessionTriggerTime(newRow.id);
              const newSessionItem = {
                photoSession: {
                  ...newRow,
                  createdAt: triggerTime,
                  created_at: triggerTime,
                },
                customer: null,
                photos: [],
                createdAt: triggerTime,
                created_at: triggerTime,
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
          const targetSessionId =
            newRow?.sessionId || newRow?.session_id || newRow?.photoSessionId;
          const customerTime =
            newRow?.createdAt ||
            newRow?.created_at ||
            saveSessionTriggerTime(targetSessionId);
          const enrichedCustomer = newRow
            ? { ...newRow, createdAt: customerTime, created_at: customerTime }
            : newRow;

          // Update customers table cache
          queryClient.setQueryData(
            ['admin', 'customers', ''],
            (oldCustomers = []) => {
              if (eventType === 'INSERT' && enrichedCustomer?.id) {
                return [enrichedCustomer, ...oldCustomers];
              }
              if (eventType === 'UPDATE' && enrichedCustomer?.id) {
                return oldCustomers.map((c) =>
                  c.id === enrichedCustomer.id ? enrichedCustomer : c,
                );
              }
              if (eventType === 'DELETE' && oldRow?.id) {
                return oldCustomers.filter((c) => c.id !== oldRow.id);
              }
              return oldCustomers;
            },
          );
          // Embed customer into matching photo session
          if (enrichedCustomer) {
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
                    return {
                      ...s,
                      customer: enrichedCustomer,
                      photoSession: {
                        ...(s.photoSession || s),
                        createdAt:
                          s.photoSession?.createdAt ||
                          s.photoSession?.created_at ||
                          customerTime,
                        created_at:
                          s.photoSession?.createdAt ||
                          s.photoSession?.created_at ||
                          customerTime,
                      },
                      createdAt: s.createdAt || customerTime,
                      created_at: s.created_at || customerTime,
                    };
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
      window.removeEventListener('dsc_session_timestamp_updated', handleLocalTrigger);
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
      const data = response.data?.data;
      if (!Array.isArray(data)) return [];
      return data.map((item) => {
        const sid = item.photoSession?.id || item.id || item.sessionId;
        const rawDate =
          item.photoSession?.createdAt ||
          item.photoSession?.created_at ||
          item.createdAt ||
          item.created_at ||
          item.customer?.createdAt ||
          item.customer?.created_at;
        const timestamp = resolveSessionTimestamp(sid, rawDate);
        return {
          ...item,
          photoSession: {
            ...(item.photoSession || {}),
            createdAt: item.photoSession?.createdAt || timestamp,
            created_at: item.photoSession?.created_at || timestamp,
          },
          createdAt: item.createdAt || timestamp,
          created_at: item.created_at || timestamp,
        };
      });
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
      const data = response.data?.data;
      if (!Array.isArray(data)) return [];
      return data.map((c) => {
        const sid = c.sessionId || c.session_id || c.photoSessionId || c.id;
        const timestamp = resolveSessionTimestamp(sid, c.createdAt || c.created_at);
        return {
          ...c,
          createdAt: c.createdAt || timestamp,
          created_at: c.created_at || timestamp,
        };
      });
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
