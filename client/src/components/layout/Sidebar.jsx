import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Image, MessageSquare, Users, Clipboard,
  FolderOpen, QrCode, ScanBarcode, MapPin, Settings, Smartphone,
  X, CloudSun
} from 'lucide-react';
import { NAV_ITEMS } from '../../utils/constants';
import { classNames } from '../../utils/helpers';

const iconMap = {
  LayoutDashboard, Image, MessageSquare, Users, Clipboard,
  FolderOpen, QrCode, ScanBarcode, MapPin, Settings, Smartphone,
};

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const navContent = (
    <nav className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-6 border-b border-white/10">
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
          <CloudSun className="h-6 w-6 text-white" />
        </div>
        <span className="text-lg font-bold text-white">Personal Server</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )
              }
            >
              {Icon && <Icon className="h-5 w-5" />}
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="text-xs text-slate-500 text-center">
          Personal Server
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-slate-900/50 backdrop-blur-xl border-r border-white/10">
          {navContent}
        </div>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 lg:hidden"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
              {navContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
