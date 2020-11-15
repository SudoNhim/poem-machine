import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import { Account } from "./models/Account";
import { ChatMessage } from "./models/ChatMessage";
import { DocUpdate } from "./models/DocUpdate";

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

  new DocUpdate({
    docId: "song.gift",
    anchor: "p1.l4",
    file: {
      title: "Gift",
      content: {
        content: {
          text: [
            [
              "You tell me that silence",
              "is nearer to peace than poems",
              "but if for my gift",
              "I brought you silence",
              "(for I know silence)",
              "you would say",
              "This is not silence",
              "this is another poem",
              "and you would hand it back to me.",
            ],
          ],
        },
      },
      kind: "song",
      annotations: [
        {
          anchor: "p1.l4",
          annotations: [
            {
              user: "anonymous",
              content: [{ kind: "text", text: "thanks I love silence" }],
            },
          ],
        },
      ],
    },
    operation: "add",
    time: "2020-11-15T18:07:25.372Z",
    user: "anonymous",
  }).save();
}
