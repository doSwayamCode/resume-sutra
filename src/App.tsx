import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Builder from "./pages/Builder";

function App() {
  const location = useLocation();
  const hideGithubIcon = location.pathname.startsWith("/builder");

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideGithubIcon && (
        <a
          href="https://github.com/doSwayamCode"
          target="_blank"
          rel="noreferrer"
          aria-label="Open doSwayamCode GitHub profile"
          className="fixed bottom-4 right-4 z-50 rounded-full border border-slate-200 bg-white p-3 text-slate-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-50"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.62-4.04-1.62-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.64.24 2.86.12 3.16.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.47 5.92.43.37.81 1.1.81 2.22v3.3c0 .32.22.69.83.58A12 12 0 0 0 12 .5Z" />
          </svg>
        </a>
      )}
    </>
  );
}

export default App;
