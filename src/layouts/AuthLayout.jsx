import { Outlet } from 'react-router-dom';
import { CloudSun } from 'lucide-react';
import BackgroundOrbs from '../components/shared/BackgroundOrbs';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50 flex items-center justify-center p-4">
      <BackgroundOrbs />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
              <CloudSun className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">DeviceCloud</h1>
          <p className="text-slate-500 text-sm mt-1">Personal Device Cloud</p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl p-8 shadow-xl shadow-slate-200/30">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
