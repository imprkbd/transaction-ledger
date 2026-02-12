import { useState } from "react";
import toast from "react-hot-toast";
import {
  useAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
} from "../features/accounts/accounts.queries";
import { getApiErrorMessage } from "../lib/apiError";
import {
  Building2,
  Phone,
  Hash,
  Users,
  Loader2,
  AlertCircle,
  PlusCircle,
  Wallet,
  Edit2,
  Trash2,
} from "lucide-react";
import CreateAccountModal from "../features/accounts/CreateAccountModal";
import EditAccountModal from "../features/accounts/EditAccountModal";
import DeleteAccountModal from "../features/accounts/DeleteAccountModal";

export default function AccountsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const { data, isLoading, isError, error } = useAccounts();

  const handleEditClick = (account) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (account) => {
    setSelectedAccount(account);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedAccount(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-sm text-slate-600">Loading accounts...</p>
      </div>
    );
  }

  if (isError) {
    const msg = getApiErrorMessage(error);
    toast.error(msg);
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 p-12">
        <div className="rounded-full bg-red-100 p-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="mt-4 font-semibold text-slate-900">
          Failed to load accounts
        </h2>
        <p className="mt-2 text-sm text-slate-600">{msg}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  const totalAccounts = data?.length ?? 0;
  const activeAccounts =
    data?.filter((a) => a.status === "active" || !a.status).length ?? 0;
  const avgBalance =
    totalAccounts > 0
      ? (
          data?.reduce((sum, acc) => sum + (acc.balance || 0), 0) /
          totalAccounts
        ).toFixed(0)
      : 0;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Accounts</h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage and view all customer accounts
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4" />
            New Account
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Total Accounts</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {totalAccounts}
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Active Accounts</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {activeAccounts}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-2">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Avg Balance</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  ${Number(avgBalance).toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-2">
                <Wallet className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                    Account No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                    Balance
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data?.map((account) => (
                  <tr key={account.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {account.customerName}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {account.phone || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-slate-600">
                        {account.accountNumber || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      ${account.balance?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(account)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(account)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-slate-100 p-3">
                <Building2 className="h-6 w-6 text-slate-400" />
              </div>
              <p className="mt-4 font-medium text-slate-900">No accounts yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Get started by creating your first account
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateAccountModal
        open={isCreateModalOpen}
        onClose={handleCloseModals}
      />

      <EditAccountModal
        open={isEditModalOpen}
        onClose={handleCloseModals}
        account={selectedAccount}
      />

      <DeleteAccountModal
        open={isDeleteModalOpen}
        onClose={handleCloseModals}
        account={selectedAccount}
      />
    </>
  );
}
