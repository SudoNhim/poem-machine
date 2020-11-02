import CanonData from "cohen-db";

import { DocUpdate } from "../models/DocUpdate";

export async function loadDocUpdates() {
  for await (const update of await DocUpdate.find()) {
    CanonData[update.docId] = update.file;
  }
}
