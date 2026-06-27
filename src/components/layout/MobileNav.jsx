import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Image, MessageSquare, Users, Clipboard,
  FolderOpen, QrCode, MoreHorizontal
} from 'lucide-react';
import { classNames } from '../../utils/helpers';

const mobileNavItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/photos', icon: Image, label: 'Photos' },
  { path: '/sms', icon: MessageSquare, label: 'SMS' },
  { path: '/contacts', icon: Users, label: 'Contacts' },
  { path: '/clipboard', icon: Clipboard, label: 'More', isMore: true },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/80 backdrop-blur-xl border-t border-slate-200/50">
      <nav className="flex items-center justify-around h-16">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                classNames(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all',
                  isActive
                    ? 'text-blue-600'
                    : 'text-slate-400 hover:text-slate-800'
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
