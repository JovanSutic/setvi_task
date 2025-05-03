/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Form, Button, Input, Schema, Loader, Modal } from "rsuite";
import Editor from "../components/Editor";
import type { FormInstance } from "rsuite";
import { useNavigate, useParams } from "react-router-dom";
import { useAppStore } from "../utils/store";
import axios, { isAxiosError } from "axios";
import { IReportCreate } from "../types/app.types";
import DataWrapper from "../components/DataWrapper";

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

export default function EditReportPage() {
  const { id } = useParams<{ id: string }>();
  const {
    reports,
    loading,
    error,
    successMessage,
    role,
    setSuccessMessage,
    setLoading,
    setError,
    updateReport,
  } = useAppStore();
  const [formValue, setFormValue] = useState<IReportCreate>({
    title: "",
    content: "",
  });
  const formRef = useRef<FormInstance>(null);
  const reportRef = useRef<IReportCreate>(null);
  const navigate = useNavigate();

  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (formRef.current?.check()) {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/reports/${id}`,
          {
            title: formValue.title,
            content: formValue.content,
          }
        );

        if (response.statusText === "OK") {
          updateReport(Number(id), formValue);
          setFormValue({ title: "", content: "" });
          setSuccessMessage("Success: Report updated.");
          setTimeout(() => {
            navigate(-1);
          }, 2500);
        }
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          setError("Failed to update the report. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  }, [formRef.current]);

  const handleSummarize = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that summarizes reports.",
            },
            {
              role: "user",
              content: `Please summarize the following report content: ${formValue.content}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 200,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );
      const summary = response.data.choices[0].message.content;
      setSummary(summary);
      setIsSummaryModalOpen(true);
    } catch (error) {
      console.error("Error summarizing report:", error);
      setError("Failed to generate the summary. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [formValue.content]);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/reports/${id}`
      );

      const { title, content } = response.data?.data || {};

      if (title && content) {
        reportRef.current = { title, content };
        setFormValue({ title, content });
      } else {
        setError("Report data is incomplete or malformed.");
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setError("Failed to fetch the report. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const isReportEdited = useMemo(() => {
    if (reportRef.current) {
      return (
        reportRef.current.content !== formValue.content.trim() ||
        reportRef.current.title !== formValue.title.trim()
      );
    }
    return false;
  }, [reportRef.current, formValue.title, formValue.content]);

  useEffect(() => {
    if (id && !reports.length) {
      fetchReport();
    } else if (id && reports.length) {
      const report = reports.find((report) => report.id === parseInt(id));

      if (report) {
        setFormValue({ title: report.title, content: report.content });
        reportRef.current = { title: report.title, content: report.content };
      } else {
        setError("Report not found.");
      }
    }
  }, [id, reports, setError, setLoading]);

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
      <div className="create-report-container">
        <h4>Edit Report</h4>
        <p className="mb-medium">Modify the report title and content below:</p>

        <Form
          ref={formRef}
          model={model}
          formValue={formValue}
          onChange={(value) => {
            if (role === "Admin") {
              setFormValue(value as IReportCreate);
            }
          }}
          disabled={role !== "Admin"}
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
              onChange={(value: string) => {
                setFormValue((prev) => ({ ...prev, content: value }));
              }}
              disabled={role !== "Admin"}
            />
          </Form.Group>
          <Form.Group>
            <Button
              appearance="ghost"
              onClick={handleSummarize}
              className="mb-small"
              disabled={loading || !formValue.content || role === "Viewer"}
            >
              Summarize Report
            </Button>
          </Form.Group>

          <Form.Group className="mt-medium">
            <Button
              appearance="primary"
              onClick={handleSubmit}
              disabled={loading || role === "Viewer" || !isReportEdited}
            >
              {loading ? "Saving..." : "Save Changes"}
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

        <Modal
          open={isSummaryModalOpen}
          onClose={() => setIsSummaryModalOpen(false)}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Summary of Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {summary ? (
              <p>{summary}</p>
            ) : (
              <Loader size="lg" content="Generating summary..." />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => setIsSummaryModalOpen(false)}
              appearance="subtle"
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DataWrapper>
  );
}
