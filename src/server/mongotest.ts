import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import { Account } from "./models/Account";
import { ChatMessage } from "./models/ChatMessage";

export async function createTestDatabase(dbName: string): Promise<void> {
  const mongod = new MongoMemoryServer({ instance: { dbName } });
  mongoose.connect(await mongod.getUri());

  // register test user
  Account.register(
    new Account({ username: "augustine", email: "augustine@hippo" }),
    "confessions"
  );

  new ChatMessage({
    user: "augustine",
    content: [
      {
        kind: "text",
        text: "God grant me chastity and continence, but not yet!",
      },
    ],
  }).save();

  new ChatMessage({
    user: "aquinas",
    content: [
      {
        kind: "text",
        text: "The things that we love tell us what we are.",
      },
    ],
  }).save();

  new ChatMessage({
    user: "anselm",
    content: [
      {
        kind: "text",
        text: "Wow, have you guys seen ",
      },
      {
        kind: "docref",
        docRef: "song.master_song",
      },
      {
        kind: "text",
        text: "? I love it. I found it on ",
      },
      {
        kind: "link",
        link: "https://leonardcohennotes.com",
        text: "Leonard Cohen Notes",
      },
    ],
  }).save();
}
