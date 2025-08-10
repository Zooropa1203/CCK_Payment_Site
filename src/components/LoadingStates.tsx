interface LoadingSkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

export function LoadingSkeleton({
  className = '',
  width = '100%',
  height = '1rem',
  variant = 'text',
}: LoadingSkeletonProps) {
  const variantClass = {
    text: 'skeleton-text',
    rectangular: 'skeleton-rect',
    circular: 'skeleton-circle',
  }[variant];

  return (
    <div
      className={`skeleton ${variantClass} ${className}`}
      style={{ width, height }}
      aria-label="로딩 중"
      role="status"
    />
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClass = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg',
  }[size];

  return (
    <div
      className={`spinner ${sizeClass} ${className}`}
      role="status"
      aria-label="로딩 중"
    >
      <div className="spinner-circle" />
      <span className="sr-only">로딩 중...</span>
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
  children?: React.ReactNode;
}

export function LoadingState({
  message = '로딩 중...',
  children,
}: LoadingStateProps) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <LoadingSpinner size="lg" />
      <p className="loading-message">{message}</p>
      {children}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function EmptyState({ title, message, action, icon }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && (
        <div className="empty-state-icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="empty-state-title">{title}</h3>
      {message && <p className="empty-state-message">{message}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title,
  message,
  onRetry,
  retryLabel = '다시 시도',
}: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state-icon" aria-hidden="true">
        ⚠
      </div>
      <h3 className="error-state-title">{title}</h3>
      {message && <p className="error-state-message">{message}</p>}
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-primary">
          {retryLabel}
        </button>
      )}
    </div>
  );
}
