import * as mongoose from "mongoose";
import * as passportLocal from "passport-local";
import * as passportLocalMongoose from "passport-local-mongoose";

interface AuthenticationResult {
  user: any;
  error: any;
}

// methods
interface PassportLocalDocument extends mongoose.Document {
  setPassword(password: string): Promise<PassportLocalDocument>;
  setPassword(password: string, cb: (err: any, res: any) => void): void;
  changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<PassportLocalDocument>;
  changePassword(
    oldPassword: string,
    newPassword: string,
    cb: (err: any, res: any) => void
  ): void;
  authenticate(password: string): Promise<AuthenticationResult>;
  authenticate(
    password: string,
    cb: (err: any, user: any, error: any) => void
  ): void;
  resetAttempts(): Promise<PassportLocalDocument>;
  resetAttempts(cb: (err: any, res: any) => void): void;
}

interface AuthenticateMethod<T> {
  (username: string, password: string): Promise<AuthenticationResult>;
  (
    username: string,
    password: string,
    cb: (err: any, user: T | boolean, error: any) => void
  ): void;
}

interface PassportLocalModel<T extends mongoose.Document>
  extends mongoose.Model<T> {
  authenticate(): AuthenticateMethod<T>;
  serializeUser(): (
    user: PassportLocalModel<T>,
    cb: (err: any, id?: any) => void
  ) => void;
  deserializeUser(): (
    username: string,
    cb: (err: any, user?: any) => void
  ) => void;

  register(user: T, password: string): Promise<T>;
  register(
    user: T,
    password: string,
    cb: (err: any, account: any) => void
  ): void;
  findByUsername(
    username: string,
    selectHashSaltFields: boolean
  ): mongoose.Query<T>;
  findByUsername(
    username: string,
    selectHashSaltFields: boolean,
    cb: (err: any, account: any) => void
  ): any;
  createStrategy(): passportLocal.Strategy;
}

var Account = new mongoose.Schema({
  username: String,
  password: String,
});

Account.plugin(passportLocalMongoose);

export default mongoose.model("Account", Account) as PassportLocalModel<
  PassportLocalDocument
>;
