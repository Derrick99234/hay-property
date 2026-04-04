import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "ol",
  "ul",
  "li",
  "a",
  "h2",
  "h3",
  "blockquote",
];

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowProtocolRelative: false,
};

function stripInvisibleBreaks(input: string) {
  return input
    .replace(/&(nbsp|#160|#xa0);/gi, " ")
    .replace(/\u00A0/g, " ")
    .replace(/&shy;|&#173;|&#x00ad;/gi, "")
    .replace(/[\u00AD\u200B\u200C\u200D\u2060\uFEFF]/g, "");
}

function normalizeInlineWordBreaks(input: string) {
  return input
    .replace(/([A-Za-z])\s*<br\s*\/?>\s*([A-Za-z])/g, "$1$2")
    .replace(/([A-Za-z])\s*\n\s*([A-Za-z])/g, "$1$2");
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function normalizeRichTextHtml(input: string) {
  const stripped = stripInvisibleBreaks(input).trim();
  if (!stripped) return "";

  if (/<[a-z][\s\S]*>/i.test(stripped)) {
    return normalizeInlineWordBreaks(stripped);
  }

  const paragraphs = stripped
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n")
    .split(/\n{2,}/)
    .map((part) => part.trim().replace(/\s*\n\s*/g, " "))
    .filter(Boolean)
    .map((part) => `<p>${escapeHtml(part)}</p>`);

  return paragraphs.join("");
}

export function sanitizeRichText(input: string) {
  const normalized = normalizeRichTextHtml(input);
  if (!normalized) return "";

  return sanitizeHtml(normalized, SANITIZE_OPTIONS)
    .replace(/&(nbsp|#160|#xa0);/gi, " ")
    .trim();
}

export function richTextToPlainText(input: string) {
  const html = sanitizeRichText(input);
  if (!html) return "";

  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|header|footer|li|h1|h2|h3|h4|h5|h6|blockquote)>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
