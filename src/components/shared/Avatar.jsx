import { getInitials, classNames } from '../../utils/helpers';

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-xl',
};

export default function Avatar({ src, name, size = 'md', className = '' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={classNames(
          'rounded-full object-cover border-2 border-white/60',
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={classNames(
        'rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-semibold text-white border-2 border-white/60',
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
