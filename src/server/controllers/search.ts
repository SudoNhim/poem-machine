import { Index } from "lunr";
import * as lunr from "lunr";
import { ISearchResults } from "../../shared/IApiTypes";
import { ExplodeAllSearchable } from "../lib/explode-searchable";
import { DeserializeDocRef } from '../../shared/util';

export interface SearchHit {
  id: string;
  preview: string;
}

// Wrap a lunr.js search index to provide functionality
// like generating previews
export class SearchController {
  private index: Index;
  private shardLookup: { [ref: string]: string } = {};

  // Note: with lunr 2.0, the index is immutable, so if
  // a document is edited, this needs to be rebuilt
  constructor() {
    const controller = this;
    this.index = lunr(function() {
      // Shards are identified by their JSONPath
      this.ref("docref");
      this.field("text");

      // Retrieve match position for generating previews
      this.metadataWhitelist = ["position"];

      for (var shard of ExplodeAllSearchable()) {
        this.add(shard);
        controller.shardLookup[shard.docref] = shard.text;
      }
    });
  }

  public search(term: string): ISearchResults {
    const hits = this.index.search(term);

    return {
      term,
      hits: hits.map(hit => ({
        id: this.docIdFromJsonPath(hit.ref),
        preview: this.shardLookup[hit.ref]
      }))
    };
  }

  private docIdFromJsonPath(ref: string): string {
    return DeserializeDocRef(ref).docId;
  }

  /*
  private generatePreview(hit: lunr.Index.Result): string {
    const doc = this.localStore[hit.ref];

    // build sorted list of all substring matches
    const metadata = hit.matchData.metadata;
    const textmatches: number[][] = [];
    Object.values(metadata).forEach(v => {
      if (v && v.text && v.text.position) {
        v.text.position.forEach((m: number[]) => {
          textmatches.push([m[0], m[0] + m[1]]);
        });
      }
    });
    textmatches.sort((m1, m2) => m1[0] - m2[0]);

    // build list of all incidences of newline chars
    const textchars = (doc.text || "").split("");
    const newlineposarr: number[] = [0];
    textchars.forEach((c, i) => {
      if (c === "\n") newlineposarr.push(i);
    });
    newlineposarr.push(textchars.length);

    // A set of text content ensures we don't add repeated lines
    // e.g. a song may repeat the same line many times
    const lineContents: Set<string> = new Set();

    // build list of whole lines that contain matches
    type LineMatches = {
      i: number;
      start: number;
      end: number;
      matches: number[][];
    }[];
    const lines: LineMatches = [];
    for (var i = 0; i < newlineposarr.length - 1; i++) {
      const start = newlineposarr[i];
      const end = newlineposarr[i + 1];
      const matches: number[][] = textmatches.filter(
        m => m[1] > start && m[0] < end
      );
      if (matches.length) {
        const str = doc.text
          .substring(start, end)
          .toLowerCase()
          .replace(/\W/g, "");

        // ensure no dupes
        if (!lineContents.has(str)) {
          lineContents.add(str);
          lines.push({ i, start, end, matches });
        }
      }
    }

    const parts: LineMatches = [];
    for (var i = 0; i < lines.length; i++) {
      const a = lines[i];
      const b = lines.length > i ? lines[i + 1] : null;
      parts.push(a);
      if (b) {
        if (b.i - a.i > 1) parts.push(null); // null -> '...' separator
      }
    }

    let result = "";
    parts.forEach(part => {
      if (part === null) result = result + "...\n";
      else result = result + doc.text.substring(part.start, part.end) + "\n";
    });

    return result;
  }*/
}
