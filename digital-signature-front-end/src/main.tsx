import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "@/app/providers/AppProviders";
import "./styles/globals.css";
import "./styles/variables.css";
import "./i18n/i18n";

// Import MSW browser worker for API mocking (development only)
import { startMsw } from "./mocks/browser";

if (import.meta.env.VITE_IS_DEV && import.meta.env.VITE_USE_MSW === 'true') {
  startMsw();
}

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  root.render(
    <StrictMode>
      <AppProviders />
    </StrictMode>,
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  );
}