import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import { Account } from "./models/Account";
import { ChatMessage } from "./models/ChatMessage";

export async function createTestDatabase(dbName: string): Promise<void> {
  const mongod = new MongoMemoryServer({ instance: { dbName } });
  mongoose.connect(await mongod.getUri());

  Account.register(
    new Account({ username: "augustine", email: "augustine@hippo" }),
    "confessions"
  );

  Account.register(
    new Account({ username: "anselm", email: "aquinas@sicily" }),
    "summa"
  );

  Account.register(
    new Account({ username: "aquinas", email: "aquinas@canterbury" }),
    "ontological"
  );

  new ChatMessage({
    time: new Date(370, 9, 22, 8, 23),
    user: "augustine",
    content: [
      {
        kind: "text",
        text: "God grant me chastity and continence, but not yet!",
      },
    ],
  }).save();

  new ChatMessage({
    time: new Date(1093, 5, 3, 10, 17),
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

  new ChatMessage({
    time: new Date(1255, 1, 15, 18, 40),
    user: "aquinas",
    content: [
      {
        kind: "text",
        text: "The things that we love tell us what we are.",
      },
    ],
  }).save();
}
