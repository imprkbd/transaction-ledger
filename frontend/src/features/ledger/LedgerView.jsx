import toast from "react-hot-toast";
import { useAddLedgerEntry, useLedger } from "./ledger.queries";
import { getApiErrorMessage } from "../../lib/apiError";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  PlusCircle,
  Wallet,
  History,
  Calendar,
  FileText,
  AlertCircle,
  ChevronLeft,
  RefreshCw,
} from "lucide-react";

const ENTRY_TYPES = [
  {
    label: "Credit",
    value: 2,
    icon: ArrowUpCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    label: "Debit",
    value: 1,
    icon: ArrowDownCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
];

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function LedgerView({ accountId, accountName }) {
  const { data, isLoading, isError, error, refetch } = useLedger(accountId);
  const addMutation = useAddLedgerEntry(accountId);

  const [type, setType] = useState(2);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function onAddEntry(e) {
    e.preventDefault();

    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    const payload = {
      accountId,
      type,
      amount: amt,
      description: description.trim() || null,
    };

    try {
      await addMutation.mutateAsync(payload);
      toast.success("Entry added successfully");
      setAmount("");
      setDescription("");
      setType(2);
      setShowForm(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 shadow-sm">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-sm text-slate-600">Loading ledger entries...</p>
      </div>
    );
  }

  if (isError) {
    const msg = getApiErrorMessage(error);
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 p-12">
        <div className="rounded-full bg-red-100 p-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="mt-4 font-semibold text-slate-900">
          Failed to load ledger
        </h2>
        <p className="mt-2 text-sm text-slate-600">{msg}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  const balance = data?.balance ?? 0;
  const entries = data?.entries ?? [];
  const totalCredits = entries
    .filter((e) => e.type === 2)
    .reduce((sum, e) => sum + e.amount, 0);
  const totalDebits = entries
    .filter((e) => e.type === 1)
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link
          to="/accounts"
          className="group flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ledger Details</h1>
          <p className="mt-1 text-sm text-slate-600">
            {accountName
              ? `Account: ${accountName}`
              : `Account ID: ${accountId}`}
          </p>
        </div>
      </div>

      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-8 translate-y-8 rounded-full bg-white/5 blur-2xl" />

        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-300">
              <Wallet className="h-5 w-5" />
              <span className="text-sm font-medium">Current Balance</span>
            </div>
            <div className="mt-3">
              <span className="text-4xl font-bold tracking-tight">
                {formatCurrency(balance)}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-300">
                <ArrowUpCircle className="h-4 w-4" />
                <span className="text-xs">Credits</span>
              </div>
              <span className="mt-1 block text-lg font-semibold text-green-300">
                {formatCurrency(totalCredits)}
              </span>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-red-300">
                <ArrowDownCircle className="h-4 w-4" />
                <span className="text-xs">Debits</span>
              </div>
              <span className="mt-1 block text-lg font-semibold text-red-300">
                {formatCurrency(totalDebits)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Entry Section */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-50 p-2">
                <PlusCircle className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="font-semibold text-slate-900">Add New Entry</h2>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {showForm ? "Cancel" : "Add Entry"}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="p-4">
            <form onSubmit={onAddEntry} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <History className="h-3.5 w-3.5" />
                    Transaction Type
                  </label>
                  <div className="flex gap-2">
                    {ENTRY_TYPES.map((t) => {
                      const Icon = t.icon;
                      const isSelected = type === t.value;
                      return (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setType(t.value)}
                          className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                            isSelected
                              ? `${t.bgColor} border-${t.value === 2 ? "green" : "red"}-200 ${t.color}`
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 ${isSelected ? t.color : ""}`}
                          />
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <Wallet className="h-3.5 w-3.5" />
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      $
                    </span>
                    <input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      inputMode="decimal"
                      placeholder="0.00"
                      className="w-full rounded-lg border border-slate-200 py-2 pl-7 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <FileText className="h-3.5 w-3.5" />
                    Description
                  </label>
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description (optional)"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-60 disabled:hover:shadow-none"
                >
                  {addMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4" />
                      Add Entry
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Entries Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-slate-100 p-2">
                <History className="h-5 w-5 text-slate-600" />
              </div>
              <h2 className="font-semibold text-slate-900">
                Transaction History
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                {entries.length} {entries.length === 1 ? "entry" : "entries"}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Date
                  </div>
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Type
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Amount
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((entry) => {
                const entryType = ENTRY_TYPES.find(
                  (t) => t.value === entry.type,
                );
                const Icon = entryType?.icon;
                return (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                      {formatDate(entry.createdAtUtc)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full ${entryType?.bgColor} px-3 py-1`}
                      >
                        {Icon && (
                          <Icon className={`h-3.5 w-3.5 ${entryType?.color}`} />
                        )}
                        <span
                          className={`text-xs font-medium ${entryType?.color}`}
                        >
                          {entryType?.label}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`font-medium ${entry.type === 2 ? "text-green-600" : "text-red-600"}`}
                      >
                        {entry.type === 2 ? "+" : "-"}
                        {formatCurrency(entry.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {entry.description || (
                        <span className="italic text-slate-400">
                          No description
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {entries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-slate-100 p-4">
                <History className="h-8 w-8 text-slate-400" />
              </div>
              <p className="mt-4 font-medium text-slate-900">
                No transactions yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Add your first transaction to get started
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                <PlusCircle className="h-4 w-4" />
                Add Transaction
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
