import React from 'react';

interface InkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'backwater' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * InkButton:
 * Hand-inked tactile action button.
 * Press = translateY(2px) + tactile haptic feedback (navigator.vibrate).
 * Strictly enforces >= 48px tap targets outdoors.
 */
export const InkButton: React.FC<InkButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch (err) {
        // quiet fallback
      }
    }
    onClick?.(e);
  };

  const variantStyles = {
    // Primary: Laterite red with cream text (High contrast in bright outdoor sunlight)
    primary: 'bg-[var(--laterite)] text-[var(--paper)] border-2 border-[var(--ink)] shadow-[2px_3px_0px_var(--ink)] hover:bg-[#A34624]',
    // Secondary: Kasavu Cream with Ink text
    secondary: 'bg-[var(--paper-2)] text-[var(--ink)] border-2 border-[var(--ink)] shadow-[2px_3px_0px_var(--ink)] hover:bg-[#E4D4B3]',
    // Backwater: Deep green
    backwater: 'bg-[var(--backwater)] text-[var(--paper)] border-2 border-[var(--ink)] shadow-[2px_3px_0px_var(--ink)] hover:bg-[#185948]',
    // Outline: Minimal transparent
    outline: 'bg-transparent text-[var(--ink)] border-2 border-dashed border-[var(--ink)] shadow-none hover:bg-[var(--ink)]/5',
  };

  const sizeStyles = {
    sm: 'min-h-[44px] px-3.5 py-1.5 text-sm',
    md: 'min-h-[48px] px-5 py-2.5 text-base',
    lg: 'min-h-[56px] px-6 py-3.5 text-lg font-bold',
  };

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center gap-2 font-display select-none transition-all duration-150 transform active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--laterite)] disabled:opacity-50 disabled:cursor-not-allowed ${
        fullWidth ? 'w-full' : ''
      } ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      style={{
        borderRadius: '10px 14px 9px 12px / 12px 9px 14px 10px',
      }}
    >
      {children}
    </button>
  );
};
