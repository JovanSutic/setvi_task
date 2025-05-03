/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import { Form, Button, Input, Schema } from "rsuite";
import Editor from "../components/Editor";
import type { FormInstance } from "rsuite";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../utils/store";
import axios, { isAxiosError } from "axios";
import DraftModal from "../components/DraftModal";
import DataWrapper from "../components/DataWrapper";

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

  const [generateDraftModalOpen, setGenerateDraftModalOpen] = useState(false);

  const formRef = useRef<FormInstance>(null);
  const navigate = useNavigate();

  const handleSubmit = useCallback(async () => {
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
        if (isAxiosError(error)) {
          setError("Failed to create the report. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  }, [formRef.current]);

  useEffect(() => {
    return () => {
      setError(null);
      setSuccessMessage(null);
    };
  }, []);

  return (
    <DataWrapper
      loading={loading}
      error={error}
      successMessage={successMessage || ""}
    >
      <div
        className="create-report-container"
      >
        <h4>Create New Report</h4>
        <p className="mb-medium">
          Fill in the report title and content below:
        </p>

        <Form
          name="create"
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

          <Form.Group>
            <Button
              appearance="ghost"
              onClick={() => {
                setGenerateDraftModalOpen(true);
                if (error || successMessage) {
                  setError(null);
                  setSuccessMessage(null);
                }
              }}
            >
              Generate Draft
            </Button>
          </Form.Group>

          <Form.Group className="mt-medium">
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
              className="ml-small"
              disabled={loading}
            >
              Cancel
            </Button>
          </Form.Group>
        </Form>

        <DraftModal
          open={generateDraftModalOpen}
          onClose={() => setGenerateDraftModalOpen(false)}
          onUseDraft={(draft: string) => {
            setFormValue((prev) => ({ ...prev, content: draft }));
            setGenerateDraftModalOpen(false);
          }}
        />
      </div>
    </DataWrapper>
  );
}
