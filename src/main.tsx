import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CustomProvider } from "rsuite";
import "rsuite/dist/rsuite.min.css";

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    await worker.start();
  }

  return;
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <CustomProvider theme="light">
        <App />
      </CustomProvider>
    </StrictMode>
  );
});
