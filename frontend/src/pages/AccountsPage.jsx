import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAccounts } from "../features/accounts/accounts.queries";
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
  BookOpen,
  RefreshCw,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CreateAccountModal from "../features/accounts/CreateAccountModal";
import EditAccountModal from "../features/accounts/EditAccountModal";
import DeleteAccountModal from "../features/accounts/DeleteAccountModal";
import Tooltip from "../components/ui/tooltip";

export default function AccountsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, isError, error, refetch } = useAccounts();

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

  // Filter accounts based on search
  const filteredAccounts =
    data?.filter(
      (account) =>
        account.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) ?? [];

  // Pagination
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAccounts = filteredAccounts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 shadow-sm">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-20"></div>
          <Loader2 className="relative h-10 w-10 animate-spin text-blue-600" />
        </div>
        <p className="mt-6 text-sm font-medium text-slate-600">
          Loading accounts...
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Please wait while we fetch your data
        </p>
      </div>
    );
  }

  if (isError) {
    const msg = getApiErrorMessage(error);
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 p-12">
        <div className="rounded-full bg-red-100 p-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          Failed to load accounts
        </h2>
        <p className="mt-2 max-w-md text-center text-sm text-slate-600">
          {msg}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-6 flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-red-700 hover:shadow-lg"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  useEffect(
    () => {
      if (isError) {
        toast.error(getApiErrorMessage(error));
      }
    },
    isError,
    error,
  );

  const totalAccounts = data?.length ?? 0;
  const activeAccounts =
    data?.filter((a) => a.status === "active" || !a.status).length ?? 0;
  const totalBalance =
    data?.reduce((sum, acc) => sum + (acc.balance || 0), 0) ?? 0;
  const avgBalance = totalAccounts > 0 ? totalBalance / totalAccounts : 0;

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 shadow-lg shadow-blue-200">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Accounts</h1>
                <p className="mt-1 text-sm text-slate-600">
                  Manage and view all customer accounts
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip content="Refresh data" position="bottom">
              <button
                onClick={() => refetch()}
                className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip content="Export accounts" position="bottom">
              <button className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                <Download className="h-5 w-5" />
              </button>
            </Tooltip>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-200 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
            >
              <PlusCircle className="h-5 w-5" />
              New Account
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-blue-200 hover:shadow-lg">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-blue-50 opacity-0 transition-all group-hover:opacity-100"></div>
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Total Accounts
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {totalAccounts.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  All registered accounts
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600 transition-all group-hover:bg-blue-100">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-green-200 hover:shadow-lg">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-green-50 opacity-0 transition-all group-hover:opacity-100"></div>
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Active Accounts
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {activeAccounts.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {((activeAccounts / totalAccounts) * 100 || 0).toFixed(0)}% of
                  total
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-2.5 text-green-600 transition-all group-hover:bg-green-100">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by customer, phone, or account number..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              >
                <span className="text-lg">×</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Filter className="h-4 w-4" />
            <span>Filter:</span>
            <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500">
              <option>All Accounts</option>
              <option>Active Only</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5" />
                      Customer
                    </div>
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      Phone
                    </div>
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    <div className="flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5" />
                      Account No
                    </div>
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-3.5 w-3.5" />
                      Balance
                    </div>
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedAccounts.map((account) => (
                  <tr
                    key={account.id}
                    className="group transition-all hover:bg-slate-50/80"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-medium">
                          {account.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-slate-900">
                            {account.customerName}
                          </div>
                          <div className="text-xs text-slate-500">
                            ID: {account.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {account.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {account.phone}
                        </div>
                      ) : (
                        <span className="text-xs italic text-slate-400">
                          No phone
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {account.accountNumber ? (
                        <span className="font-mono text-sm font-medium text-slate-700">
                          {account.accountNumber}
                        </span>
                      ) : (
                        <span className="text-xs italic text-slate-400">
                          No account number
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="text-sm font-semibold text-slate-900">
                        {formatCurrency(account.balance)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Tooltip content="View Ledger" position="top">
                          <Link
                            to={`/ledger/${account.id}`}
                            state={{ accountName: account.customerName }}
                            className="rounded-lg p-2 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <BookOpen className="h-4 w-4" />
                          </Link>
                        </Tooltip>

                        <Tooltip content="Edit Account" position="top">
                          <button
                            onClick={() => handleEditClick(account)}
                            className="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </Tooltip>

                        <Tooltip content="Delete Account" position="top">
                          <button
                            onClick={() => handleDeleteClick(account)}
                            className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredAccounts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-slate-200"></div>
                <div className="relative rounded-full bg-slate-100 p-4">
                  {searchTerm ? (
                    <Search className="h-8 w-8 text-slate-400" />
                  ) : (
                    <Building2 className="h-8 w-8 text-slate-400" />
                  )}
                </div>
              </div>

              {searchTerm ? (
                <>
                  <h3 className="mt-4 text-lg font-medium text-slate-900">
                    No accounts found
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    No results match "{searchTerm}". Try adjusting your search.
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-6 flex items-center gap-2 rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-200"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <h3 className="mt-4 text-lg font-medium text-slate-900">
                    No accounts yet
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Get started by creating your first account
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-6 flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-200 transition-all hover:from-blue-700 hover:to-indigo-700"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Create Account
                  </button>
                </>
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredAccounts.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-5 py-3">
              <div className="text-sm text-slate-600">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredAccounts.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredAccounts.length}</span>{" "}
                accounts
              </div>

              <div className="flex items-center gap-2">
                <Tooltip content="Previous page" position="top">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </Tooltip>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`min-w-[36px] rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Tooltip content="Next page" position="top">
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </Tooltip>
              </div>
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
