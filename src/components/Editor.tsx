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
};

function CustomEditor({ value, onChange }: CustomEditorProps) {
  const handleChange = (e: ContentEditableEvent) => {
    const dirtyHtml = e.target.value;
    const cleanHtml = sanitize(dirtyHtml);

    onChange(cleanHtml);
  };

  return (
    <Editor
      value={value}
      onChange={handleChange}
      style={{ minHeight: "200px", maxHeight: "320px", overflow: "auto" }}
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
