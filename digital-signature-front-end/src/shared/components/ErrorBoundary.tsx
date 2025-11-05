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
    <div className="flex items-center justify-center min-h-screen p-4">
      <Result
        status="error"
        title={t('errors.unexpected', 'Something went wrong')}
        subTitle={
          <div className="space-y-2">
            <p>{t('errors.unexpectedDescription', 'An unexpected error occurred. Please try again.')}</p>
            {error && import.meta.env.DEV && (
              <details className="text-left mt-4 p-4 bg-gray-100 rounded">
                <summary className="cursor-pointer font-medium">Error details (dev mode)</summary>
                <pre className="mt-2 text-xs overflow-auto">
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

