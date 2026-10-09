import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'md' | 'sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingText?: string;
}

const clasesMd: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
};

// En tablas (size="sm") se conserva el estilo compacto btn-link.
const clasesSm: Record<Variant, string> = {
  primary: 'btn-link',
  secondary: 'btn-link',
  danger: 'btn-link btn-link--danger',
  ghost: 'btn-link',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  type = 'button',
  className,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const clase = [size === 'sm' ? clasesSm[variant] : clasesMd[variant], className].filter(Boolean).join(' ');
  return (
    <button type={type} className={clase} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading && loadingText ? loadingText : children}
    </button>
  );
}
