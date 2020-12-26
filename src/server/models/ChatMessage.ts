import { Token } from "cohen-db/schema";
import mongoose from "mongoose";

// When a document has outstanding changes the latest version is stored in
// the mongodb updates table
export interface IChatMessage extends mongoose.Document {
  time: Date;
  user: string;
  content: any[]; // legacy
  tokens: Token[];
}

const ChatMessageSchema = new mongoose.Schema<IChatMessage>({
  time: Date,
  user: String,
  content: [Object],
});

export const ChatMessage = mongoose.model<IChatMessage>(
  "ChatMessage",
  ChatMessageSchema
);
