import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { primeSettings } from "./lib/siteSettings";
import "./styles.css";

// Code-split so public visitors never download the admin panel's JS, and
// vice versa — meaningfully smaller initial bundle for both.
const App = lazy(() => import("./App"));
const AdminApp = lazy(() => import("./admin/AdminApp").then((m) => ({ default: m.AdminApp })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
});

const isAdmin = window.location.pathname.startsWith("/admin");

// Start the one request every page needs (site photos) before React and
// the page code have even downloaded.
if (!isAdmin) primeSettings(queryClient);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        {isAdmin ? (
          <AdminApp />
        ) : (
          <BrowserRouter>
            <App />
          </BrowserRouter>
        )}
      </Suspense>
    </QueryClientProvider>
  </StrictMode>,
);
