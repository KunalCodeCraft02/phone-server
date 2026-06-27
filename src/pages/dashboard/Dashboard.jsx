import { motion } from 'framer-motion';
import { useStats, useActivity } from '../../hooks/useDashboard';
import useSocket from '../../hooks/useSocket';
import StatsCards from './StatsCards';
import ActivityTimeline from './ActivityTimeline';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { Activity, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: activityData, isLoading: activityLoading } = useActivity({ limit: 20 });

  useSocket('stats:update', () => {});
  useSocket('activity:new', () => {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Overview</h2>
        <p className="text-slate-500 text-sm">Your personal device cloud at a glance</p>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <StatsCards stats={stats} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg shadow-slate-200/40">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
          </div>
          {activityLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="h-8 w-8 bg-slate-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                    <div className="h-2 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ActivityTimeline activities={activityData?.activities || []} />
          )}
        </div>

        <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg shadow-slate-200/40">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-slate-800">Quick Stats</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Photos this week', value: stats?.photosThisWeek ?? 0, max: 50 },
              { label: 'SMS this week', value: stats?.smsThisWeek ?? 0, max: 100 },
              { label: 'Files uploaded', value: stats?.filesUploaded ?? 0, max: 30 },
              { label: 'Active devices', value: stats?.activeDevices ?? 0, max: 5 },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">{stat.label}</span>
                  <span className="text-sm font-medium text-slate-800">{stat.value}</span>
                </div>
                <div className="h-2 bg-slate-200/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((stat.value / stat.max) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
