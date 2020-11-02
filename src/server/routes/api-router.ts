import * as bodyParser from "body-parser";
import CanonData from "cohen-db";
import { Router } from "express";
import * as passport from "passport";

import { IAnnotation, IDoc } from "../../shared/IApiTypes";
import { AnnotationsController } from "../controllers/annotations";
import { GraphController } from "../controllers/graph";
import { SearchController } from "../controllers/search";
import { GeneratePreview } from "../lib/generate-preview";
import { Account, IAccount } from "../models/Account";
import { createRememberMeToken } from "../models/RememberMeToken";

const jsonParser = bodyParser.json();

export function apiRouter() {
  const router = Router();
  const graphProvider = new GraphController();
  const annotationsProvider = new AnnotationsController();
  const searchController = new SearchController();

  router.get("/docs/get/:docId", async (req, res) => {
    const doc = CanonData[req.params.docId];

    if (doc == null) return res.sendStatus(404);

    const referrers = graphProvider.getReferrers(req.params.docId);
    const annotations = annotationsProvider.getAnnotations(req.params.docId);

    const out: IDoc = {
      file: doc,
      annotations,
    };

    if (doc.children)
      out.children = doc.children.map((id) => GeneratePreview({ docId: id }));

    if (referrers.length > 0)
      out.referrers = referrers.map((ref) => GeneratePreview(ref));

    res.json(out);
  });

  router.get("/docs/graph", async (req, res) => {
    res.json(graphProvider.getGraph());
  });

  router.get("/docs/search/:term", async (req, res) => {
    res.json(searchController.search(req.params.term));
  });

  router.get("/user", async (req, res) => {
    res.json({ user: req.user });
  });

  router.post("/login", passport.authenticate("local"), async (req, res) => {
    try {
      console.log("attempting initial cookie issue");
      const token = await createRememberMeToken(req.user as IAccount);
      res.cookie("remember_me", token, {
        path: "/",
        httpOnly: true,
        maxAge: 6048000000, // 70 days
      });
    } catch (err) {
      console.log("failed to issue initial cookie in login", err);
    }

    res.status(200);
    res.end();
  });

  router.post("/register", bodyParser.json(), async (req, res) => {
    const data: { username: string; email: string; password: string } =
      req.body;

    if (!data.username || data.username.length < 3)
      return res.json({ error: "Username must be at least three characters" });

    if (!data.email) return res.json({ error: "Email required" });

    if (!data.password || data.password.length < 6)
      return res.json({ error: "Password must be at least six characters" });

    if (await Account.exists({ username: data.username }))
      return res.json({ error: "Username taken" });

    if (await Account.exists({ email: data.email }))
      return res.json({ error: "An account already exists for this email" });

    Account.register(
      new Account({ username: data.username, email: data.email }),
      data.password,
      function (error) {
        if (error) {
          return res.json({ error });
        }

        passport.authenticate("local")(req, res, async function () {
          try {
            const token = await createRememberMeToken(req.user as IAccount);
            res.cookie("remember_me", token, {
              path: "/",
              httpOnly: true,
              maxAge: 6048000000, // 70 days
            });
          } catch (err) {
            console.log("failed to issue initial cookie in registration", err);
          }
          res.redirect("/");
        });
      }
    );
  });

  return router;
}
