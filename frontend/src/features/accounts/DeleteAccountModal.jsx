import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import { useDeleteAccount } from "./accounts.queries";
import { getApiErrorMessage } from "../../lib/apiError";
import { Trash2 } from "lucide-react";

export default function DeleteAccountModal({ open, onClose, account }) {
  const deleteMutation = useDeleteAccount();

  async function handleDelete() {
    if (!account?.id) return;
    try {
      await deleteMutation.mutateAsync(account.id);
      toast.success("Account deleted");
      onClose();
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  }

  return (
    <Modal open={open} title="Delete Account" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-red-100 p-2">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900">Are you sure?</h3>
            <p className="text-sm text-slate-500">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {account && (
          <div className="rounded-lg bg-slate-50 p-3 text-sm">
            <p>
              <span className="font-medium">Customer:</span>{" "}
              {account.customerName}
            </p>
            {account.accountNumber && (
              <p className="mt-1">
                <span className="font-medium">Account No:</span>{" "}
                {account.accountNumber}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!account || deleteMutation.isPending}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
