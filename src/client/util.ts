import { Reference, Token } from "cohen-db/schema";

import { IDoc } from "../shared/ApiTypes";
import {
  DeserializeDocRef,
  FragmentToPlaintext,
  SerializeDocRef,
} from "../shared/util";

function trimString(str: string, len: number): string {
  if (str.length < len) return str;

  const lastSpace = str.substr(0, len).lastIndexOf(" ");
  return str.substr(0, lastSpace) + "...";
}

export function snippetFromDoc(doc: IDoc, docRef: Reference): string {
  const content = doc.file.content;
  if (!content) return "";

  const fragmentId = docRef.kind === "fragment" ? docRef.fragmentId : null;
  const sectionId =
    docRef.kind === "fragment" || docRef.kind === "section"
      ? docRef.sectionId || null
      : null;
  const fragments =
    content.kind === "multipart"
      ? content.content.find(
          (section) => !sectionId || section.id === sectionId
        ).fragments
      : content.content.fragments;
  const fragment = fragments.find(
    (frag) => !fragmentId || (frag.kind === "text" && frag.id === fragmentId)
  );
  const text = fragment ? FragmentToPlaintext(fragment) : "";

  return trimString(text, 64);
}

export function textToTokens(text: string): Token[] {
  const extLinksRegex = /\[([^\[]+)\]\((\S*)\)/;
  const docRefsRegex = /\B#(\w*[A-Za-z_]\.[A-Za-z_0-9]*)/;
  const tokens: Token[] = [];
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
        kind: "reference",
        reference: DeserializeDocRef(docRefMatch[1]),
      });
      text = text.substr(docRefMatch[0].length);
    } else {
      tokens.push({ kind: "text", text: text.substr(0, textMatchIndex) });
      text = text.substr(textMatchIndex);
    }
  }

  return tokens;
}

export function tokensToText(tokens: Token[]): string {
  return tokens
    .map((tok) => {
      if (tok.kind === "text") return tok.text;
      if (tok.kind === "reference") return `#${SerializeDocRef(tok.reference)}`;
      else return `[${tok.text}](${tok.link})`;
    })
    .join("");
}
