import * as mongoose from "mongoose";

import { Account, IAccount } from "./Account";

interface IRememberMeToken extends mongoose.Document {
  account: mongoose.Schema.Types.ObjectId;
  token: string;
  issued: Date;
}

const RememberMeTokenSchema = new mongoose.Schema<IRememberMeToken>({
  account: mongoose.Schema.Types.ObjectId,
  token: String,
  issued: Date,
});

export const RememberMeToken = mongoose.model<IRememberMeToken>(
  "RememberMeToken",
  RememberMeTokenSchema
);

export async function createRememberMeToken(user: IAccount): Promise<string> {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const uid = [...Array(16).keys()]
    .map((_) => chars[Math.floor(Math.random() * chars.length)])
    .join("");
  await RememberMeToken.create({
    account: user._id,
    token: uid,
    issued: Date.now(),
  });
  return uid;
}

export async function consumeRememberMeToken(token: string): Promise<IAccount> {
  const retrieved = await RememberMeToken.findOneAndDelete({ token });

  // Token wasn't found. Don't throw here - we drop the database for any reason
  // users will just need to log in again, they should not see an error.
  if (!retrieved) return null;

  return Account.findById(retrieved.account);
}
