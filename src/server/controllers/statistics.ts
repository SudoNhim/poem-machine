import { IAppStatistics } from "../../shared/IApiTypes";
import docsDb from "../database";
import { Account } from "../models/Account";
import { ChatMessage } from "../models/ChatMessage";

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
}
