import { CanonFile } from "cohen-db/schema";
import mongoose from "mongoose";

// When a document has outstanding changes the latest version is stored in
// the mongodb updates table
export interface IDocUpdate extends mongoose.Document {
  docId: string;
  file: CanonFile;
}

const DocUpdateSchema = new mongoose.Schema<IDocUpdate>({
  docId: String,
  file: Object,
});

export const DocUpdate = mongoose.model<IDocUpdate>(
  "DocUpdate",
  DocUpdateSchema
);
