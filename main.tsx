import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import ErrorBoundary from "@/components/ErrorBoundary";

// Global error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault(); // Prevent default browser behavior
});

// Global error handling for JavaScript errors  
window.addEventListener('error', event => {
  console.error('JavaScript error:', event.error);
});

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ThemeProvider defaultTheme="light" storageKey="exitcheck-theme">
      <App />
    </ThemeProvider>
  </ErrorBoundary>
);
