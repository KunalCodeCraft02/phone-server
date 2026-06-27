import { classNames } from '../../utils/helpers';

export default function Skeleton({ className = '', count = 1 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={classNames(
            'animate-pulse bg-white/10 rounded-xl',
            className || 'h-4 w-full'
          )}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white/5 rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-1/3" />
      <div className="h-8 bg-white/10 rounded w-1/2" />
      <div className="h-3 bg-white/10 rounded w-2/3" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 animate-pulse">
          <div className="h-10 w-10 bg-white/10 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/10 rounded w-1/4" />
            <div className="h-3 bg-white/10 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
