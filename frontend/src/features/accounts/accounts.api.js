import { apiClient } from "../../lib/apiClient";

export async function getAccounts({ page, pageSize, status, search }) {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    status,
    search,
  });

  if (search) {
    params.append("search", search);
  }

  const res = await apiClient.get(`/api/accounts?${params.toString()}`);
  return res.data;
}

export async function getDashboardStats() {
  const res = await apiClient.get("/api/dashboard/stats");
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
