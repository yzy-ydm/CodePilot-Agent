import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bot, FolderKanban } from 'lucide-react';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: '仪表盘' },
  { to: '/agent', icon: Bot, label: 'AI Agent' },
  { to: '/projects', icon: FolderKanban, label: '我的项目' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 p-4 z-40">
      <nav className="flex flex-col gap-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
