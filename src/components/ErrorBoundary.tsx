import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error in boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-surface text-on-surface font-sans">
          <div className="max-w-md w-full p-6 bg-red-50 border border-red-200 rounded-lg text-center shadow-sm">
            <h2 className="text-lg font-bold text-red-800 mb-2 font-sans">Something went wrong while loading this page.</h2>
            <p className="text-xs text-red-700 font-mono text-left bg-white p-3 rounded border border-red-100 max-h-48 overflow-auto mb-4 whitespace-pre-wrap">
              {this.state.error?.stack || this.state.error?.message || "An unexpected dynamic error occurred."}
            </p>
            <button
              id="error-boundary-retry-button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-semibold transition-colors font-sans cursor-pointer"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
