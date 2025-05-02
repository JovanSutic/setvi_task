import React, {
  forwardRef,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import axios, { isAxiosError } from "axios";
import { Form, Button, Input, Schema, Modal } from "rsuite";
import type { FormInstance, InputProps } from "rsuite";
import { sanitize } from "../utils/helpers";

const { StringType } = Schema.Types;

type TextAreaProps = InputProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => <Input {...props} as="textarea" ref={ref} rows={5} />
);

const model = Schema.Model({
  instructions: StringType()
    .isRequired("Instructions are required.")
    .minLength(10, "Please provide at least 10 characters."),
});

type DraftModalProps = {
  open: boolean;
  onClose: () => void;
  onUseDraft: (draft: string) => void;
};

function DraftModal({
  open,
  onClose,
  onUseDraft,
}: DraftModalProps) {
  const [formValue, setFormValue] = useState({ instructions: "" });
  const [reportDraft, setReportDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormInstance>(null);

  const handleGenerateReport = async () => {
    if (!formRef.current?.check()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant who writes professional report drafts.",
            },
            {
              role: "user",
              content: `Please write a draft report based on the following instructions and return the draft in html format: ${formValue.instructions}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 800,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_TOKEN}`,
          },
        }
      );

      const draft = response.data.choices[0].message.content;
      setReportDraft(draft);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Error generating report:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      if (reportDraft) {
        setReportDraft("");
      }

      if (formValue.instructions) {
        setFormValue({ instructions: "" });
      }
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} size="md">
      <Modal.Header>
        <Modal.Title>Generate Report Draft</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          name="draft"
          ref={formRef}
          model={model}
          formValue={formValue}
          onChange={(value) => setFormValue(value as { instructions: string })}
          fluid
        >
          <Form.Group controlId="instructions">
            <Form.ControlLabel>Instructions</Form.ControlLabel>
            <Form.Control name="instructions" accepter={TextArea} />
            <Form.HelpText>Minimum 10 characters.</Form.HelpText>
          </Form.Group>

          <Form.Group>
            <Button
              appearance="primary"
              onClick={handleGenerateReport}
              loading={loading}
            >
              Generate
            </Button>

            {reportDraft && (
              <Button
                appearance="ghost"
                onClick={() => {
                  onUseDraft(reportDraft);
                  onClose();
                }}
                style={{ marginLeft: 8 }}
              >
                Use Draft
              </Button>
            )}
          </Form.Group>
        </Form>

        {reportDraft && (
          <div style={{ marginTop: 20 }}>
            <h5 style={{ marginBottom: "8px" }}>Draft Report</h5>
            <div
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: "12px",
                fontStyle: "italic",
              }}
              dangerouslySetInnerHTML={{ __html: sanitize(reportDraft) }}
            />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default React.memo(DraftModal);