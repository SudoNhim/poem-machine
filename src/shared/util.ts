import { Fragment, Reference } from "cohen-db/schema";

export function SerializeDocRef(ref: Reference): string {
  switch (ref.kind) {
    case "document":
      return `${ref.documentId}`;
    case "section":
      return `${ref.documentId}#${ref.sectionId}:`;
    case "fragment":
      return ref.sectionId
        ? `${ref.documentId}#${ref.sectionId}:${ref.fragmentId}`
        : `${ref.documentId}#${ref.fragmentId}`;
  }
}

export function DeserializeDocRef(ref: string): Reference {
  // If there is anything after (.e.g /notes) ignore
  ref = ref.split("/")[0];

  const [documentId, rest] = ref.split("#");
  if (!rest) return { kind: "document", documentId };
  if (!rest.includes(":"))
    return { kind: "fragment", documentId, fragmentId: rest };
  const [sectionId, fragmentId] = rest.split(":");
  if (!fragmentId) return { kind: "section", documentId, sectionId };
  else return { kind: "fragment", documentId, sectionId, fragmentId };
}

export function DocRefEquals(a: Reference, b: Reference): boolean {
  return SerializeDocRef(a) === SerializeDocRef(b);
}

export function FragmentToPlaintext(frag: Fragment): string {
  if (frag.kind === "text") {
    return frag.tokens
      .map((tok) =>
        tok.kind === "text"
          ? tok.text
          : tok.kind === "reference"
          ? tok.reference
          : tok.text || tok.link
      )
      .join("");
  }
}
