import { useEffect, useRef, useState } from "react";
import { Form, Button, Input, Schema, Message, Loader } from "rsuite";
import Editor from "../components/Editor";
import type { FormInstance } from "rsuite";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../utils/store";
import axios from "axios";

interface CreateReportForm {
  title: string;
  content: string;
}

const { StringType } = Schema.Types;

function htmlToPlainText(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent || "").trim();
}

const model = Schema.Model({
  title: StringType()
    .isRequired("Report title is required.")
    .minLength(5, "Title must be at least 5 characters."),
  content: StringType()
    .isRequired("Report content is required.")
    .minLength(10, "Content must be at least 10 characters.")
    .addRule((value) => {
      const plainText = htmlToPlainText(value);
      if (plainText.length < 10) {
        return false;
      }

      return true;
    }, "Content must be at least 10 characters."),
});

export default function CreateReportPage() {
  const [formValue, setFormValue] = useState<CreateReportForm>({
    title: "",
    content: "",
  });
  const {
    loading,
    error,
    successMessage,
    setSuccessMessage,
    addReport,
    setLoading,
    setError,
  } = useAppStore();

  const formRef = useRef<FormInstance>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (formRef.current?.check()) {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/reports`,
          {
            title: formValue.title,
            content: formValue.content,
          }
        );

        if (response.statusText === "OK") {
          addReport(formValue);
          setFormValue({ title: "", content: "" });
          setSuccessMessage("Success: New report created.");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError("Failed to create the report. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      setError(null);
      setSuccessMessage(null);
    };
  }, []);

  return (
    <div
      className="create-report-container"
      style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}
    >
      <h4>Create New Report</h4>
      <p style={{ marginBottom: 20 }}>
        Fill in the report title and content below:
      </p>

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

      <Form
        ref={formRef}
        model={model}
        formValue={formValue}
        onChange={(value) => {
          setFormValue(value as CreateReportForm);
        }}
        fluid
      >
        <Form.Group controlId="title">
          <Form.ControlLabel>Report Title</Form.ControlLabel>
          <Form.Control name="title" accepter={Input} />
        </Form.Group>

        <Form.Group controlId="content">
          <Form.ControlLabel>Report Content</Form.ControlLabel>
          <Form.Control
            name="content"
            accepter={Editor}
            value={formValue.content}
            onChange={(value: string) =>
              setFormValue((prev) => ({ ...prev, content: value }))
            }
          />
        </Form.Group>

        {error && <Message type="error">{error}</Message>}
        {successMessage && <Message type="success">{successMessage}</Message>}

        <Form.Group style={{ marginTop: "24px" }}>
          <Button
            appearance="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Report"}
          </Button>
          <Button
            appearance="subtle"
            onClick={() => navigate(-1)}
            style={{ marginLeft: 10 }}
            disabled={loading}
          >
            Cancel
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
