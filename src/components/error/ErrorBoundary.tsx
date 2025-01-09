import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'sonner';

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<FallbackProps> | ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      toast.error('Something went wrong. Please try refreshing the page.');
    }
  }

  public resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        if (React.isValidElement(this.props.fallback)) {
          return this.props.fallback;
        }
        const FallbackComponent = this.props.fallback as React.ComponentType<FallbackProps>;
        return <FallbackComponent error={this.state.error} resetErrorBoundary={this.resetErrorBoundary} />;
      }
      return (
        <div className="p-4 rounded-lg bg-red-50 text-red-800">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p>Please try refreshing the page. If the problem persists, contact support.</p>
        </div>
      );
    }

    return this.props.children;
  }
}