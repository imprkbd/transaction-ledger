import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAccount,
  deleteAccount,
  getAccounts,
  getDashboardStats,
  updateAccount,
} from "./accounts.api";

export const accountsKeys = {
  all: ["accounts"],
  lists: () => [...accountsKeys.all, "list"],
  list: (filters) => [...accountsKeys.lists(), filters],
  stats: ["accounts", "stats"],
  details: () => [...accountsKeys.all, "detail"],
  detail: (id) => [...accountsKeys.details(), id],
};

export function useAccounts(
  page = 1,
  pageSize = 10,
  status = "all",
  search = "",
) {
  return useQuery({
    queryKey: [
      ...accountsKeys.list({ page, pageSize, status, search }),
      "paginated",
    ],
    queryFn: () => getAccounts({ page, pageSize, status, search }),
    keepPreviousData: true,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: accountsKeys.stats,
    queryFn: getDashboardStats,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accountsKeys.stats });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateAccount(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accountsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accountsKeys.stats });
      queryClient.invalidateQueries({
        queryKey: accountsKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accountsKeys.stats });
    },
  });
}
