import { Fragment, TextFragment } from "cohen-db/schema";

import { SerializeDocRef } from "../../shared/util";
import docsDb from "../database";

export interface CanonShard {
  docref: string; // serialized docref
  text: string;
}

// Return all shards in the database that can be used for text search
export function ExplodeAllSearchable(): CanonShard[] {
  const out: CanonShard[] = [];

  for (var key in docsDb) {
    const doc = docsDb[key];

    // titles
    out.push({
      docref: SerializeDocRef({
        kind: "document",
        documentId: key,
      }),
      text: doc.title,
    });

    // metadata properties appropriate for searching
    if (doc.metadata) {
      const parts: string[] = [];
      if (doc.metadata.event) parts.push(doc.metadata.event);
      if (doc.metadata.location) {
        const loc = doc.metadata.location;
        if (loc.city) parts.push(loc.city);
        if (loc.country) parts.push(loc.country);
        if (loc.venue) parts.push(loc.venue);
        out.push({
          docref: SerializeDocRef({
            kind: "document",
            documentId: key,
          }),
          text: parts.join(" "),
        });
      }
    }

    const fragToText = (frag: TextFragment): string => {
      return frag.tokens
        .map((tok) => (tok.kind === "text" ? tok.text : ""))
        .join(" ");
    };

    // text content
    const addText = (text: Fragment[], sectionId?: string) => {
      text.forEach((frag) => {
        if (frag.kind === "text" && frag.id) {
          out.push({
            docref: SerializeDocRef({
              kind: "fragment",
              documentId: key,
              sectionId,
              fragmentId: frag.id,
            }),
            text: fragToText(frag),
          });
        }
      });
    };

    if (doc.content) {
      if (doc.content.kind === "multipart") {
        for (const section of doc.content.content) {
          addText(section.fragments, section.id);
        }
      } else addText(doc.content.content.fragments, null);
    }
  }

  return out;
}
