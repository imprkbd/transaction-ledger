import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from "./accounts.api";

export const accountsKeys = {
  all: ["accounts"],
};

export function useAccounts() {
  return useQuery({
    queryKey: accountsKeys.all,
    queryFn: getAccounts,
  });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => qc.invalidateQueries({ queryKey: accountsKeys.all }),
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateAccount(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: accountsKeys.all }),
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => qc.invalidateQueries({ queryKey: accountsKeys.all }),
  });
}
