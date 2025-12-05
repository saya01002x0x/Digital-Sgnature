import type { ReactNode, ErrorInfo } from 'react';
import type React from 'react';
import { Component } from 'react';
import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch React errors
 * Displays a fallback UI when an error occurs
 */
class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

type ErrorFallbackProps = {
  error: Error | null;
  onReset: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReset }) => {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 16 }}>
      <Result
        status="error"
        title={t('errors.unexpected', 'Something went wrong')}
        subTitle={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p>{t('errors.unexpectedDescription', 'An unexpected error occurred. Please try again.')}</p>
            {error && import.meta.env.DEV && (
              <details style={{ textAlign: 'left', marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
                <summary style={{ cursor: 'pointer', fontWeight: 500 }}>Error details (dev mode)</summary>
                <pre style={{ marginTop: 8, fontSize: 12, overflow: 'auto' }}>
                  {error.toString()}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </details>
            )}
          </div>
        }
        extra={[
          <Button type="primary" key="reset" onClick={onReset}>
            {t('common.tryAgain', 'Try Again')}
          </Button>,
          <Button key="home" onClick={() => (window.location.href = '/')}>
            {t('common.goHome', 'Go to Home')}
          </Button>,
        ]}
      />
    </div>
  );
};

// Export as default for easier use
export const ErrorBoundary = ErrorBoundaryClass;

