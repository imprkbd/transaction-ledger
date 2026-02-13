import { NavLink, Outlet } from "react-router-dom";
import { LayoutGrid, BookOpen } from "lucide-react";
import Tooltip from "../ui/tooltip";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600"></div>
            <span className="font-semibold text-slate-900">
              Transaction Ledger
            </span>
          </div>

          <nav className="flex items-center gap-1 text-sm">
            <Tooltip content="Accounts" position="bottom">
              <NavLink
                to="/accounts"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <LayoutGrid className="h-4 w-4" />
                <span>Accounts</span>
              </NavLink>
            </Tooltip>

            <Tooltip content="Ledger" position="bottom">
              <NavLink
                to="/ledger"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <BookOpen className="h-4 w-4" />
                <span>Ledger</span>
              </NavLink>
            </Tooltip>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
