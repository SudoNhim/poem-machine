import { Reference } from "cohen-db/schema";

export function SerializeDocRef(ref: Reference): string {
  switch (ref.kind) {
    case "document":
      return `${ref.documentId}`;
    case "section":
      return `${ref.documentId}#${ref.sectionId}/`;
    case "fragment":
      return ref.sectionId
        ? `${ref.documentId}#${ref.sectionId}/${ref.fragmentId}`
        : `${ref.documentId}#${ref.fragmentId}`;
  }
}

export function DeserializeDocRef(ref: string): Reference {
  const [documentId, rest] = ref.split("#");
  if (!rest) return { kind: "document", documentId };
  if (!rest.includes("/"))
    return { kind: "fragment", documentId, fragmentId: rest };
  const [sectionId, fragmentId] = rest.split("/");
  if (!fragmentId) return { kind: "section", documentId, sectionId };
  else return { kind: "fragment", documentId, sectionId, fragmentId };
}

export function DocRefEquals(a: Reference, b: Reference): boolean {
  return SerializeDocRef(a) === SerializeDocRef(b);
}
