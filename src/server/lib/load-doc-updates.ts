import docsDb from "../database";
import { DocUpdate } from "../models/DocUpdate";

export async function loadDocUpdates() {
  for await (const update of await DocUpdate.find()) {
    const docId = update.action.documentId;
    if (docsDb[docId].version < update.file.version) {
      docsDb[docId] = update.file;
    }
  }
}

function anchorToNumber(anch: string): number {
  const nums = anch
    .split(".")
    .map((p) => p.substr(1))
    .map((l) => parseInt(l));
  return nums.reduce((prev, cur) => prev * 100 + cur, 0);
}

export function compareAnchors(a: string, b: string): number {
  return anchorToNumber(a) > anchorToNumber(b) ? 1 : -1;
}
