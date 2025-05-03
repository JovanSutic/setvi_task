import DOMPurify from "dompurify";

export const sanitize = (text: string) => {
  return DOMPurify.sanitize(text, {
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
};


export function truncateString(input: string): string {
  return input.length > 25 ? input.slice(0, 22) + '...' : input;
}