import CanonData from "cohen-db";
import { SerializeDocRef } from "../../shared/util";
import { Text } from "cohen-db/schema";

export interface CanonShard {
  docref: string; // serialized docref
  text: string;
}

// Return all shards in the database that can be used for text search
export function ExplodeAllSearchable(): CanonShard[] {
  const out: CanonShard[] = [];

  for (var key in CanonData) {
    const doc = CanonData[key];

    // titles
    out.push({
      docref: SerializeDocRef({
        docId: key
      }),
      text: doc.title
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
            docId: key
          }),
          text: parts.join(" ")
        });
      }
    }

    // text content
    const addText = (text: Text, section?: number) => {
      text.text.forEach((p, pi) => {
        if (Array.isArray(p))
          p.forEach((l, li) => {
            out.push({
              docref: SerializeDocRef({
                docId: key,
                section,
                paragraph: pi + 1,
                line: li + 1
              }),
              text: l
            });
          });
        else
          out.push({
            docref: SerializeDocRef({
              docId: key,
              section,
              paragraph: pi + 1
            }),
            text: p
          });
      });
    };

    if (doc.content) {
      if (Array.isArray(doc.content.content))
        doc.content.content.forEach((cnt, i) => addText(cnt.content, i + 1));
      else addText(doc.content.content, null);
    }
  }

  return out;
}
