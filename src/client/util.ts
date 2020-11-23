import { IContentToken, IDoc } from "../shared/ApiTypes";

function trimString(str: string, len: number): string {
  if (str.length < len) return str;

  const lastSpace = str.substr(0, len).lastIndexOf(" ");
  return str.substr(0, lastSpace) + "...";
}

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
  const str = Array.isArray(paragraph) ? paragraph[parts.l - 1] : paragraph;

  return trimString(str, 64);
}

export function textToTokens(text: string): IContentToken[] {
  const extLinksRegex = /\[([^\[]+)\]\((\S*)\)/;
  const docRefsRegex = /\B#(\w*[A-Za-z_]\.[A-Za-z_0-9]*)/;
  const tokens: IContentToken[] = [];
  while (text) {
    const extLinkMatch = text.match(extLinksRegex);
    const docRefMatch = text.match(docRefsRegex);
    const textMatchIndex = Math.min(
      text.length,
      extLinkMatch?.index || 9999,
      docRefMatch?.index || 9999
    );
    if (extLinkMatch && extLinkMatch.index === 0) {
      tokens.push({
        kind: "link",
        text: extLinkMatch[1],
        link: extLinkMatch[2],
      });
      text = text.substr(extLinkMatch[0].length);
    } else if (docRefMatch && docRefMatch.index === 0) {
      tokens.push({
        kind: "docref",
        docRef: docRefMatch[1],
      });
      text = text.substr(docRefMatch[0].length);
    } else {
      tokens.push({ kind: "text", text: text.substr(0, textMatchIndex) });
      text = text.substr(textMatchIndex);
    }
  }

  return tokens;
}

export function tokensToText(tokens: IContentToken[]): string {
  return tokens
    .map((tok) => {
      if (tok.kind === "text") return tok.text;
      if (tok.kind === "docref") return `#${tok.docRef}`;
      else return `[${tok.text}](${tok.link})`;
    })
    .join("");
}
