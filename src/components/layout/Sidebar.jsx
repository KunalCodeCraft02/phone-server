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
      <div className="flex items-center gap-3 px-4 py-6 border-b border-slate-200/50">
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
          <CloudSun className="h-6 w-6 text-white" />
        </div>
        <span className="text-lg font-bold text-slate-800">DeviceCloud</span>
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
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                )
              }
            >
              {Icon && <Icon className="h-5 w-5" />}
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="px-3 py-4 border-t border-slate-200/50">
        <div className="text-xs text-slate-400 text-center">
          Personal Device Cloud
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white/50 backdrop-blur-xl border-r border-slate-200/50">
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
              className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white/90 backdrop-blur-xl border-r border-slate-200/50 lg:hidden"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
              {navContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
