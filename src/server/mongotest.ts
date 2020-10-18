import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";

import Account from "./models/Account";

export async function createTestDatabase(dbName: string): Promise<void> {
  const mongod = new MongoMemoryServer({ instance: { dbName } });
  mongoose.connect(await mongod.getUri());

  // register test user
  Account.register(new Account({ username: "augustine@hippo" }), "confessions");
}
