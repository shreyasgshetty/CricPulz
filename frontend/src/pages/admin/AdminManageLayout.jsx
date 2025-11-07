import { Link, Outlet, useLocation } from "react-router-dom";
import { Layers, Users, Trophy } from "lucide-react";
import clsx from "clsx";

export default function AdminManageLayout() {
  const location = useLocation();

  const links = [
    { path: "/admin/manage/series", label: "Series", icon: Layers },
    { path: "/admin/manage/matches", label: "Matches", icon: Trophy },
    { path: "/admin/manage/teams", label: "Teams", icon: Users },
  ];

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col p-5">
        <h2 className="text-2xl font-bold mb-8 text-blue-400 text-center">
          ⚙ Admin Panel
        </h2>

        <nav className="flex flex-col gap-2">
          {links.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={clsx(
                "flex items-center gap-3 px-4 py-2 rounded-md transition-all text-sm font-medium",
                location.pathname === path
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto text-xs text-gray-500 text-center pt-6 border-t border-gray-700">
          Admin Management © {new Date().getFullYear()}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 bg-gray-900">
        <Outlet />
      </main>
    </div>
  );
}