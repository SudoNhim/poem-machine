import {
  IAnnotationUpdate,
  IAppStatistics,
  IAppUpdate,
  IChatUpdate,
  IDeploymentUpdate,
} from "../../shared/IApiTypes";
import docsDb from "../database";
import { Account } from "../models/Account";
import { ChatMessage } from "../models/ChatMessage";
import { DocUpdate } from "../models/DocUpdate";

const appStart: IDeploymentUpdate = {
  kind: "deployment",
  time: new Date().toISOString(),
};

export class StatisticsController {
  public async getStatistics(): Promise<IAppStatistics> {
    let documentsCount = 0;
    let stubsCount = 0;
    let annotationsCount = 0;
    for (var id in docsDb) {
      const doc = docsDb[id];
      if (doc.content) documentsCount++;
      else stubsCount++;

      for (var grp of doc.annotations) {
        annotationsCount += grp.annotations.length;
      }
    }

    const usersCount = await Account.count({});
    const chatMessagesCount = await ChatMessage.count({});

    return {
      documentsCount,
      stubsCount,
      usersCount,
      annotationsCount,
      chatMessagesCount,
    };
  }

  public async getFeed(): Promise<IAppUpdate[]> {
    let updates: IAppUpdate[] = [appStart];

    const messages = await ChatMessage.find();
    const messageUpdates: IChatUpdate[] = messages.map((msg) => ({
      kind: "chat",
      count: 1,
      time: msg.time.toISOString(),
    }));
    updates.push(...messageUpdates);

    const docUpdates = await DocUpdate.find();
    const annotationUpdates: IAnnotationUpdate[] = docUpdates.map((update) => ({
      kind: "annotation",
      time: update.time.toISOString(),
      user: update.user,
      target: update.docId,
      anchor: update.anchor,
    }));
    updates.push(...annotationUpdates);

    updates.sort((a, b) => (a.time < b.time ? -1 : 1));

    // sequential chat updates are collated so as not to dominate the feed
    const chatCollator = (
      accum: IAppUpdate[],
      cur: IAppUpdate
    ): IAppUpdate[] => {
      const prev = accum && accum[accum.length - 1];
      if (cur.kind === "chat" && prev && prev.kind === "chat") {
        prev.count++;
        return accum;
      } else {
        return [...accum, cur];
      }
    };
    updates = updates.reduce(chatCollator, []);

    // limit to most recent 10 updates
    const start = Math.max(0, updates.length - 10);
    updates = updates.slice(start);

    return updates;
  }
}
