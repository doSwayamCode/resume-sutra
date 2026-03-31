import { Component, ReactNode } from "react";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
    message: "",
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || "Something went wrong.",
    };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("App runtime error:", error, info);
  }

  clearDraftAndReload = () => {
    try {
      localStorage.removeItem("resume-sutra-draft-v1");
    } catch {
      // Ignore storage cleanup errors and still reload.
    }
    window.location.href = "/";
  };

  reloadPage = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
          <p className="mt-2 text-sm text-slate-600">
            The app hit a runtime issue. You can reload the page or clear the saved draft and start fresh.
          </p>
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{this.state.message}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={this.reloadPage}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Reload
            </button>
            <button
              type="button"
              onClick={this.clearDraftAndReload}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Clear Saved Draft and Go Home
            </button>
          </div>
        </div>
      </main>
    );
  }
}

export default AppErrorBoundary;
