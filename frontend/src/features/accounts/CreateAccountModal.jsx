import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import { useCreateAccount } from "./accounts.queries";
import { getApiErrorMessage } from "../../lib/apiError";

export default function CreateAccountModal({ open, onClose }) {
  const createMutation = useCreateAccount();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      customerName: "",
      phone: "",
      accountNumber: "",
    },
  });

  async function onSubmit(values) {
    try {
      await createMutation.mutateAsync({
        customerName: values.customerName.trim(),
        phone: values.phone?.trim() || null,
        accountNumber: values.accountNumber?.trim() || null,
      });
      toast.success("Account created");
      reset();
      onClose();
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  }

  return (
    <Modal open={open} title="Create Account" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-slate-600">
            Customer Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("customerName", {
              validate: (value) =>
                value.trim().length > 0 || "Customer name is required",
            })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Enter customer name"
          />
          {errors.customerName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.customerName.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-600">Phone</label>
          <input
            {...register("phone")}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-600">
            Account Number
          </label>
          <input
            {...register("accountNumber")}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Enter account number"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {createMutation.isPending ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
