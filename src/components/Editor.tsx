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
import DOMPurify from "dompurify";

export default function CustomEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (cleanHtml: string) => void;
}) {
  const handleChange = (e: ContentEditableEvent) => {
    const dirtyHtml = e.target.value;
    const cleanHtml = DOMPurify.sanitize(dirtyHtml, {
      USE_PROFILES: { html: true },
      ALLOWED_TAGS: [
        "b",
        "i",
        "u",
        "em",
        "strong",
        "a",
        "p",
        "br",
        "ul",
        "ol",
        "li",
        "blockquote",
        "code",
        "pre",
        "span",
      ],
      ALLOWED_ATTR: ["href", "target", "title", "class", "style"],
      ALLOWED_URI_REGEXP: /^(https?|mailto):/,
    });

    onChange(cleanHtml);
  };

  return (
    <Editor value={value} onChange={handleChange}>
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
