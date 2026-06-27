import { classNames } from '../../utils/helpers';

export default function Card({ children, className = '', hover = false, onClick, ...props }) {
  return (
    <div
      className={classNames(
        'bg-white/50 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg shadow-slate-200/40',
        hover && 'hover:bg-white/70 transition-all duration-300 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
