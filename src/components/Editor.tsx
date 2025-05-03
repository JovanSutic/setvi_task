import React from "react";
import Editor, {
  BtnBold,
  BtnItalic,
  BtnStrikeThrough,
  BtnLink,
  BtnUndo,
  BtnUnderline,
  BtnRedo,
  Toolbar,
  ContentEditableEvent,
} from "react-simple-wysiwyg";
import { sanitize } from "../utils/helpers";

type CustomEditorProps = {
  value: string;
  onChange: (cleanHtml: string) => void;
  disabled?: boolean;
};

function CustomEditor({
  value,
  onChange,
  disabled = false,
}: CustomEditorProps) {
  const handleChange = (e: ContentEditableEvent) => {
    const dirtyHtml = e.target.value;
    const cleanHtml = sanitize(dirtyHtml);

    onChange(cleanHtml);
  };

  return (
    <Editor
      value={value}
      onChange={handleChange}
      className="editor-wrapper"
      disabled={disabled}
    >
      <Toolbar>
        <BtnUndo />
        <BtnRedo />
        <BtnBold />
        <BtnItalic />
        <BtnUnderline />
        <BtnStrikeThrough />
        <BtnLink />
      </Toolbar>
    </Editor>
  );
}

export default React.memo(CustomEditor);
