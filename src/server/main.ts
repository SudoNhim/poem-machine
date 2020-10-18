import * as path from "path";

import * as express from "express";
import * as expressSession from "express-session";
import * as mongoose from "mongoose";
import * as passport from "passport";

import { COOKIE_SECRET, MONGODB_STR, SERVER_PORT } from "./config";
import Account from "./models/Account";
import { createTestDatabase } from "./mongotest";
import { apiRouter } from "./routes/api-router";
import { pagesRouter } from "./routes/pages-router";
import { staticsRouter } from "./routes/statics-router";

const app = express();
app.set("view engine", "ejs");

// Auth
app.use(
  expressSession({
    secret: COOKIE_SECRET || "testsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 10000000000, // ~3mo max cookie age
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Auth config
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

if (MONGODB_STR) mongoose.connect(MONGODB_STR);
else createTestDatabase("test");

// Routing
app.use("/assets", express.static(path.join(process.cwd(), "assets")));
app.use("/api", apiRouter());
app.use("/statics", staticsRouter());

// Everything not matched by the above falls through to the app page
app.use(pagesRouter());

app.listen(SERVER_PORT, () => {
  console.log(`App listening on port ${SERVER_PORT}!`);
});
