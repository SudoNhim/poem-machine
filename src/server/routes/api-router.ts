import bodyParser from "body-parser";
import { Router } from "express";
import passport from "passport";

import { IAnnotation, IDoc } from "../../shared/IApiTypes";
import { AnnotationsController } from "../controllers/annotations";
import { GraphController } from "../controllers/graph";
import { SearchController } from "../controllers/search";
import { StatisticsController } from "../controllers/statistics";
import docsDb from "../database";
import { GeneratePreview } from "../lib/generate-preview";
import { compareAnchors } from "../lib/load-doc-updates";
import { Account, IAccount } from "../models/Account";
import { DocUpdate, IDocUpdate } from "../models/DocUpdate";
import { createRememberMeToken } from "../models/RememberMeToken";

const jsonParser = bodyParser.json();

export function apiRouter() {
  const router = Router();
  const graphProvider = new GraphController();
  const annotationsProvider = new AnnotationsController();
  const searchController = new SearchController();
  const statisticsController = new StatisticsController();

  router.get("/docs/get/:docId", async (req, res) => {
    const doc = docsDb[req.params.docId];

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

  router.post(
    "/docs/:docId/annotations/:anchor/add",
    jsonParser,
    async (req, res) => {
      const docId: string = req.params.docId;
      const anchor: string = req.params.anchor;
      const reqAnnotation: IAnnotation = req.body.annotation;
      const doc = docsDb[docId];
      const username = req.user ? (req.user as IAccount).username : "anonymous";

      if (username !== reqAnnotation.user && reqAnnotation.user !== "anonymous")
        throw new Error(
          `User ${username} not authorized to edit annotation by ${reqAnnotation.user}`
        );

      // Copy out so if we make a new group and then crash we don't leave it there
      const docAnnotations = [...doc.annotations];

      // If no annotations group exists for this anchor, make a new one
      if (!docAnnotations.find((grp) => grp.anchor === anchor)) {
        docAnnotations.push({ anchor, annotations: [] });
        docAnnotations.sort((a, b) => compareAnchors(a.anchor, b.anchor));
      }

      const group = docAnnotations.find((grp) => grp.anchor === anchor);

      // If this is an edit, edit in place
      const isEdit = reqAnnotation.indexByUser >= 0;
      if (isEdit) {
        const existing = group.annotations.filter(
          (anno) => anno.user === reqAnnotation.user
        );
        existing[reqAnnotation.indexByUser].content = reqAnnotation.content;
      } else {
        // otherwise add
        group.annotations.push({
          user: username,
          content: reqAnnotation.content,
        });
      }

      doc.annotations = docAnnotations;
      await DocUpdate.findOneAndUpdate(
        { docId },
        {
          time: new Date(),
          docId,
          file: doc,
          user: username,
          anchor,
          operation: isEdit ? "edit" : "add",
        },
        { upsert: true }
      );

      res.end();
    }
  );

  router.post(
    "/docs/:docId/annotations/:anchor/delete",
    jsonParser,
    async (req, res) => {
      const docId: string = req.params.docId;
      const anchor: string = req.params.anchor;
      const reqAnnotation: IAnnotation = req.body.annotation;
      const doc = docsDb[docId];
      const username = req.user ? (req.user as IAccount).username : "anonymous";

      if (username !== reqAnnotation.user && reqAnnotation.user !== "anonymous")
        throw new Error("User not authorized to edit that annotation");

      const group = doc.annotations.find((grp) => grp.anchor === anchor);
      let countByUser = 0;
      group.annotations = group.annotations.filter((anno) => {
        if (anno.user === reqAnnotation.user) {
          if (countByUser === reqAnnotation.indexByUser) return false;
          else countByUser++;
        } else return true;
      });

      doc.annotations = doc.annotations.filter(
        (grp) => grp.annotations.length > 0
      );

      await DocUpdate.findOneAndUpdate(
        { docId },
        {
          time: new Date(),
          docId,
          file: doc,
          user: username,
          anchor,
          operation: "delete",
        },
        { upsert: true }
      );

      res.end();
    }
  );

  router.get("/updates", async (req, res) => {
    const updates: IDocUpdate[] = [];
    for await (const update of await DocUpdate.find()) {
      const { _id, __v, ...file } = update.toObject();
      updates.push(file);
    }
    res.json(updates);
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

    if (!data.username || data.username.length < 3 || data.username.length > 20)
      return res.json({
        error: "Username must be at least 3 characters and no more than 20",
      });

    if (!data.email) return res.json({ error: "Email required" });

    if (!data.password || data.password.length < 6)
      return res.json({ error: "Password must be at least six characters" });

    if (
      (await Account.exists({ username: data.username })) ||
      ["anonymous", "symbols bot"].includes(data.username)
    )
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

  router.get("/statistics", async (req, res) => {
    res.json(await statisticsController.getStatistics());
  });

  router.get("/feed", async (req, res) => {
    res.json(await statisticsController.getFeed());
  });

  return router;
}
