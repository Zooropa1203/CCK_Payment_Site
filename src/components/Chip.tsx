import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

export type ChipVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';
export type ChipSize = 'sm' | 'md';

interface ChipProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ChipVariant;
  size?: ChipSize;
  children: ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

const Chip = forwardRef<HTMLDivElement, ChipProps>(({
  variant = 'default',
  size = 'md',
  children,
  removable = false,
  onRemove,
  className = '',
  ...props
}, ref) => {
  const baseClass = 'chip';
  const variantClass = `chip-${variant}`;
  const sizeClass = `chip-${size}`;

  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={classes}
      {...props}
    >
      <span className="chip-content">{children}</span>
      {removable && (
        <button
          type="button"
          className="chip-remove"
          onClick={onRemove}
          aria-label="제거"
        >
          ✕
        </button>
      )}
    </div>
  );
});

Chip.displayName = 'Chip';

export default Chip;
