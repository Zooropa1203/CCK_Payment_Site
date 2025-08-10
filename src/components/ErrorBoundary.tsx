import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>문제가 발생했습니다</h2>
            <p>
              예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후
              다시 시도해주세요.
            </p>
            <details className="error-details">
              <summary>기술적 세부사항</summary>
              <pre>{this.state.error?.message}</pre>
            </details>
            <div className="error-actions">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                페이지 새로고침
              </button>
              <button
                type="button"
                onClick={() => this.setState({ hasError: false })}
                className="btn-secondary"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
