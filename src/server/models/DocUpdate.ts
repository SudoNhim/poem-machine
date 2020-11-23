import { CanonFile } from "cohen-db/schema";
import mongoose from "mongoose";

import { IUserAction } from "../../shared/UserActions";

// When a document has outstanding changes the latest version is stored in
// the mongodb updates table
export interface IDocUpdate extends mongoose.Document {
  time: Date;
  user: string;
  action: IUserAction;
  file: CanonFile;
}

const DocUpdateSchema = new mongoose.Schema<IDocUpdate>({
  time: Date,
  user: String,
  action: Object,
  file: Object,
});

export const DocUpdate = mongoose.model<IDocUpdate>(
  "DocUpdate",
  DocUpdateSchema
);
