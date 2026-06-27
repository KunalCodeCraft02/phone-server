import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsAPI } from '../services/contacts';
import { QUERY_KEYS } from '../utils/constants';
import toast from 'react-hot-toast';

export function useContacts(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CONTACTS, params],
    queryFn: async () => {
      const { data } = await contactsAPI.getAll(params);
      return data;
    },
  });
}

export function useSyncContacts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contacts) => contactsAPI.sync(contacts),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACTS });
      toast.success('Contacts synced');
    },
    onError: () => toast.error('Failed to sync contacts'),
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => contactsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACTS });
      toast.success('Contact updated');
    },
    onError: () => toast.error('Failed to update contact'),
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => contactsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACTS });
      toast.success('Contact deleted');
    },
    onError: () => toast.error('Failed to delete contact'),
  });
}

export function useExportContacts() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await contactsAPI.exportCSV();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contacts.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Contacts exported');
    },
    onError: () => toast.error('Failed to export contacts'),
  });
}
