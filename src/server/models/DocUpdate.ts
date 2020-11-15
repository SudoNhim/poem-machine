import { CanonFile } from "cohen-db/schema";
import mongoose from "mongoose";

// When a document has outstanding changes the latest version is stored in
// the mongodb updates table
export interface IDocUpdate extends mongoose.Document {
  time: Date;
  user: string;
  docId: string;
  file: CanonFile;
  anchor: string; // TODO factor out annotation updates from doc updates
  operation: "add" | "edit" | "delete";
}

const DocUpdateSchema = new mongoose.Schema<IDocUpdate>({
  time: Date,
  user: String,
  docId: String,
  file: Object,
  anchor: String,
  operation: String,
});

export const DocUpdate = mongoose.model<IDocUpdate>(
  "DocUpdate",
  DocUpdateSchema
);
