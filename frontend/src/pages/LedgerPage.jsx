import { useParams, useLocation, Navigate, replace } from "react-router-dom";
import LedgerView from "../features/ledger/LedgerView";
import { useAccounts } from "../features/accounts/accounts.queries";

export default function LedgerPage() {
  const { accountId } = useParams();
  const { data: accounts } = useAccounts();
  const location = useLocation();

  const account = accounts?.items?.find((acc) => acc.id === accountId);
  const accountName = account?.customerName || location.state?.accountName;

  if (!accountId) {
    return <Navigate to={"/accounts"} replace />;
  }

  return (
    <div className="py-6">
      <LedgerView accountId={accountId} accountName={accountName} />
    </div>
  );
}
