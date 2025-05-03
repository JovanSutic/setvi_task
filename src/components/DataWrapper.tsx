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
          className="loader-wrapper"
        >
          <Loader size="lg" content="Loading..." vertical />
        </div>
      )}

      {error && (
        <Message type="error" className="mb-medium">
          {error}
        </Message>
      )}
      {successMessage && (
        <Message type="success" className="mb-medium">
          {successMessage}
        </Message>
      )}

      {children}
    </>
  );
}

export default DataWrapper;
