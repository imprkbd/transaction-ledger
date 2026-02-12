import { apiClient } from "../../lib/apiClient";

export async function getAccounts() {
  const res = await apiClient.get("/api/accounts");
  return res.data;
}

export async function createAccount(payload) {
  const res = await apiClient.post("/api/accounts", payload);
  return res.data;
}

export async function updateAccount(id, payload) {
  const res = await apiClient.put(`/api/accounts/${id}`, payload);
  return res.data;
}

export async function deleteAccount(id) {
  await apiClient.delete(`/api/accounts/${id}`);
}
