import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  props: Props;
  constructor(props: Props) {
    super(props);
  }

  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error at ErrorBoundary:", error, errorInfo);

    // Attempt sending logs to backend SQLite API
    fetch("/api/client_errors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: error.message || String(error),
        stack: error.stack || "",
        url: window.location.href,
        component: errorInfo.componentStack?.substring(0, 1000) || "Unknown",
      }),
    }).catch((err) => console.error("Failed to post browser error log:", err));
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 select-none"
          dir="ltr"
        >
          <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 animate-pulse">
              <span className="text-2xl font-bold">⚠️</span>
            </div>
            <h1 className="text-2xl font-serif text-void font-bold">
              Something went wrong
            </h1>
            <p className="text-gray-500 text-sm">
              An unexpected validation or rendering exception occurred. The
              error has been captured and logged automatically for our
              development team to resolve.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2.5 px-4 bg-void text-white font-bold rounded-lg text-sm hover:bg-magenta transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return (this.props as any).children;
  }
}
