import React, { Component, ErrorInfo, ReactNode } from "react";

import { STRINGS } from "@/shared/constants/strings.constants";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class LocalizedErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in DocumentDetails:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-surface-container rounded-2xl border border-error/20 text-center glass-card">
          <h2 className="text-xl font-bold text-error mb-2">{STRINGS.details.error}</h2>
          <p className="text-sm text-outline mb-4">
            {this.state.error?.message || "An unexpected error occurred in this module."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default LocalizedErrorBoundary;
