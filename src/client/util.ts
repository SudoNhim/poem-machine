import { IDoc } from "../shared/IApiTypes";

export function snippetFromDoc(doc: IDoc, docPart: string): string {
  const parts = {
    s: 1,
    p: 1,
    l: 1,
  };
  docPart.split(".").forEach((bit) => {
    const key = bit.substr(0, 1);
    const val = parseInt(bit.substr(1));
    parts[key] = val;
  });

  const content = doc.file.content?.content;
  if (!content) return "";

  const text = Array.isArray(content)
    ? content[parts.s - 1].content.text
    : content.text;

  const paragraph = text[parts.p - 1];
  return Array.isArray(paragraph) ? paragraph[parts.l - 1] : paragraph;
}
