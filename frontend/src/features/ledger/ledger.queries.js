import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addLedgerEntry, getLedger } from "./ledger.api";

export const ledgerKeys = {
  byAccount: (accountId) => ["ledger", accountId],
};

export function useLedger(accountId) {
  return useQuery({
    queryKey: ledgerKeys.byAccount(accountId),
    queryFn: () => getLedger(accountId),
    enabled: !!accountId,
  });
}

export function useAddLedgerEntry(accountId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addLedgerEntry,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ledgerKeys.byAccount(accountId) }),
  });
}
