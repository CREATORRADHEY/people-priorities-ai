import { Component, ErrorInfo, ReactNode } from 'react';


interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class DashboardErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[DashboardErrorBoundary] Uncaught widget error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.fallback || (
          <div className="p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-md text-rose-200">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Widget Render Failure
            </h3>
            <p className="text-sm opacity-80 mb-4">
              This component encountered an unexpected error and failed to render.
            </p>
            {this.state.error && (
              <pre className="text-xs p-3 bg-black/40 rounded-lg overflow-x-auto border border-rose-500/10 font-mono">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        )
      );
    }

    return this.props.children;
  }

  private get fallback(): ReactNode {
    return this.props.fallback;
  }
}
export default DashboardErrorBoundary;
