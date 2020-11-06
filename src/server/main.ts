import { createServer } from "http";
import path from "path";

import express from "express";
import expressSession from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as RememberMeStrategy } from "passport-remember-me-extended";

import { COOKIE_SECRET, MONGODB_STR, SERVER_PORT } from "./config";
import { loadDocUpdates } from "./lib/load-doc-updates";
import { Account } from "./models/Account";
import {
  consumeRememberMeToken,
  createRememberMeToken,
} from "./models/RememberMeToken";
import { createTestDatabase } from "./mongotest";
import { apiRouter } from "./routes/api-router";
import { pagesRouter } from "./routes/pages-router";
import { staticsRouter } from "./routes/statics-router";
import { setupSocketIo } from "./socket";

import cookieParser = require("cookie-parser");

async function main() {
  try {
    // Database
    if (MONGODB_STR) mongoose.connect(MONGODB_STR);
    else createTestDatabase("test");
    await loadDocUpdates();

    // Auth config
    passport.use(Account.createStrategy());
    passport.serializeUser(Account.serializeUser());
    passport.deserializeUser(Account.deserializeUser());
    passport.use(
      new RememberMeStrategy(
        async (token, done) => {
          try {
            const account = await consumeRememberMeToken(token);
            return done(null, account);
          } catch (err) {
            console.log("failed to consume cookie", err);
            return done(err);
          }
        },
        async (user, done) => {
          try {
            const token = await createRememberMeToken(user);
            return done(null, token);
          } catch (err) {
            console.log("failed to reissue cookie", err);
            return done(err);
          }
        }
      )
    );

    // Webserver
    const app = express();
    app.set("view engine", "ejs");

    // Auth middleware
    app.use(cookieParser());
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
    app.use(passport.authenticate("remember-me"));

    // Routing
    app.use("/assets", express.static(path.join(process.cwd(), "assets")));
    app.use("/api", apiRouter());
    app.use("/statics", staticsRouter());

    // Everything not matched by the above falls through to the app page
    app.use(pagesRouter());

    const server = createServer(app);
    setupSocketIo(server);

    server.listen(SERVER_PORT, () => {
      console.log(`App listening on port ${SERVER_PORT}!`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
