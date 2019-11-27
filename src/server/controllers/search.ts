import { Index } from "lunr";
import * as lunr from "lunr";
import { ISearchResults, IDocReference, IDocReferencePreview } from "../../shared/IApiTypes";
import { ExplodeAllSearchable } from "../lib/explode-searchable";
import { GeneratePreview } from '../lib/generate-preview';
import { DeserializeDocRef, SerializeDocRef } from '../../shared/util';
import { isNullOrUndefined } from 'util';

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

    const hitsByDocPart: { [ref: string]: IDocReference[] } = {};
    hits.forEach(hit => {
      const ref = DeserializeDocRef(hit.ref);
      ref.substrings = [];
      Object.values(hit.matchData.metadata).forEach(v => {
        if (v && v.text && v.text.position) {
          v.text.position.forEach((m: number[]) => {
            ref.substrings.push([m[0], m[1]]);
          });
        }
      });

      const sref = `${ref.docId}|${(isNullOrUndefined(ref.section) ? '' : ref.section)}`;
      if (!hitsByDocPart[sref]) {
        hitsByDocPart[sref] = [];
      }

      hitsByDocPart[sref].push(ref);
    })

    return {
      term,
      hits: hits.map(h => DeserializeDocRef(h.ref)),
      previews: Object.keys(hitsByDocPart).map(sref => this.generatePreview(hitsByDocPart[sref]))
    };
  }

  private generatePreview(refs: IDocReference[]): IDocReferencePreview {
    // Because serialization yields order id/part/para/line/substring, we can use it
    // for sorting. It's a bit of a hack, but saves a lot of code.
    refs = refs.sort((a, b) => SerializeDocRef(a) < SerializeDocRef(b) ? -1 : 1);

    // For now we only base preview on the first ref from each part
    const activeRef = refs[0];

    return GeneratePreview(activeRef);
  }
}
