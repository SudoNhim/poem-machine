import { DocrefToken, ExternalLinkToken, TextToken } from "cohen-db/schema";
import mongoose from "mongoose";

// TODO: export this from the db library
type ContentToken = TextToken | ExternalLinkToken | DocrefToken;

// When a document has outstanding changes the latest version is stored in
// the mongodb updates table
export interface IChatMessage extends mongoose.Document {
  user: string;
  content: ContentToken[];
}

const ChatMessageSchema = new mongoose.Schema<IChatMessage>({
  user: String,
  content: [Object],
});

export const ChatMessage = mongoose.model<IChatMessage>(
  "ChatMessage",
  ChatMessageSchema
);
