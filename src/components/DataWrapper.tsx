import { Loader, Message } from "rsuite";
import { ReactNode } from "react";

interface DataWrapperProps {
  loading: boolean;
  error: string | null;
  children: ReactNode;
  successMessage?: string;
}

function DataWrapper({
  loading,
  error,
  successMessage,
  children,
}: DataWrapperProps) {
  return (
    <>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255, 255, 255, 0.6)",
            zIndex: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader size="lg" content="Loading..." vertical />
        </div>
      )}

      {error && (
        <Message type="error" style={{ marginBottom: "16px" }}>
          {error}
        </Message>
      )}
      {successMessage && (
        <Message type="success" style={{ marginBottom: "16px" }}>
          {successMessage}
        </Message>
      )}

      {children}
    </>
  );
}

export default DataWrapper;
