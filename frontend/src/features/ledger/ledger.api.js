import { apiClient } from "../../lib/apiClient";

export async function getLedger(accountId) {
  const res = await apiClient.get(`/api/ledger/${accountId}`);
  return res.data;
}

export async function addLedgerEntry(payload) {
  const res = await apiClient.post("/api/ledger", payload);
  return res.data;
}
