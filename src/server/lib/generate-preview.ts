import { Fragment, Reference, Token } from "cohen-db/schema";

import { IDocReferencePreview } from "../../shared/ApiTypes";
import { SerializeDocRef } from "../../shared/util";
import docsDb from "../database";

export function GeneratePreview(docRef: Reference): IDocReferencePreview {
  const doc = docsDb[docRef.documentId];

  if (!doc.content) {
    return {
      docRef,
      preview: [],
    };
  }

  // Build a preview around the first match position
  let activeFragments: Fragment[];
  if (doc.content.kind === "multipart") {
    if (
      docRef.kind === "section" ||
      (docRef.kind === "fragment" && docRef.sectionId)
    ) {
      activeFragments = doc.content.content.find(
        (section) => section.id === docRef.sectionId
      ).fragments;
    } else if (docRef.kind === "document") {
      activeFragments = doc.content.content[0].fragments;
    } else {
      throw new Error(
        `The reference ${SerializeDocRef(docRef)} is not valid for document ${
          docRef.documentId
        }`
      );
    }
  } else {
    activeFragments = doc.content.content.fragments;
  }
  return {
    docRef,
    preview: GeneratePreviewText(
      activeFragments,
      docRef.kind === "fragment" ? docRef.fragmentId : null
    ),
  };
}

// Generate a shortened preview view of the text that includes the targeted fragment
function GeneratePreviewText(frags: Fragment[], targetId?: string): Fragment[] {
  const hit = targetId
    ? frags.findIndex((frag) => frag.kind === "text" && frag.id === targetId)
    : 0;

  let indexBefore = hit;
  let indexAfter = hit + 1;
  let balance = 0;
  let budget = 256;
  let result: Fragment[] = [];
  while (budget > 0) {
    let toAdd: Fragment;
    let addBefore: boolean;
    if (balance <= 0 && indexBefore >= 0) {
      toAdd = frags[indexBefore--];
      addBefore = true;
    } else if (balance > 0 && indexAfter < frags.length) {
      toAdd = frags[indexAfter++];
      addBefore = false;
    } else {
      break; // Consumed all fragments
    }

    let cost = costFragment(toAdd);
    if (cost > budget) {
      toAdd = trimFragment(toAdd, budget, addBefore);
      cost = budget;

      if (!toAdd) break; // Trimmed to nothing, don't add
    }

    result = addBefore ? [toAdd, ...result] : [...result, toAdd];
    budget -= cost;
    balance += addBefore ? cost : -cost;
  }

  return result;
}

// Estimate the space used by a fragment
function costFragment(frag: Fragment): number {
  if (frag.kind === "lineBreak") return 32;
  else return frag.tokens.map((tok) => costToken(tok)).reduce((a, b) => a + b);
}

function costToken(tok: Token): number {
  return tok.kind === "text"
    ? tok.text.length
    : tok.kind === "link"
    ? tok.text?.length || tok.link.length
    : tok.reference.documentId.length;
}

// Reduce a fragment to the specified max length,
// trimming from start or end
function trimFragment(
  frag: Fragment,
  budget: number,
  fromStart: boolean
): Fragment | null {
  if (frag.kind === "lineBreak") {
    return null;
  } else {
    const result: Fragment = {
      ...frag,
      tokens: [],
    };

    const source = frag.tokens.map((tok) => tok);
    if (fromStart) source.reverse();
    for (const tok of source) {
      let cost = costToken(tok);
      let toAdd = tok;
      if (cost > budget) {
        if (toAdd.kind === "text") {
          toAdd = {
            ...toAdd,
            text: trimText(toAdd.text, budget, fromStart),
          };
          cost = budget;
        } else {
          break;
        }
      }

      result.tokens = fromStart
        ? [toAdd, ...result.tokens]
        : [...result.tokens, toAdd];
      budget -= cost;
      if (budget <= 0) break;
    }

    return result;
  }
}

function trimText(text: string, budget: number, fromStart: boolean): string {
  if (text.length <= budget) return text;

  if (fromStart) {
    const firstSpace = text
      .substr(text.length - budget, text.length)
      .indexOf(" ");
    if (firstSpace < 0) return "...";
    return "..." + text.substr(firstSpace, text.length);
  } else {
    const lastSpace = text.substr(0, text.length).lastIndexOf(" ");
    if (lastSpace < 0) return "...";
    return text.substr(0, lastSpace) + "...";
  }
}
