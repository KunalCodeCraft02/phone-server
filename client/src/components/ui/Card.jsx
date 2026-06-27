import { classNames } from '../../utils/helpers';

export default function Card({ children, className = '', hover = false, onClick, ...props }) {
  return (
    <div
      className={classNames(
        'bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl',
        hover && 'hover:bg-white/15 transition-all duration-300 cursor-pointer',
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
