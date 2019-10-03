import { ObjectID, Collection, FindOneOptions } from "mongodb";
import { DbDoc } from "./models";
import { SearchWrapper } from "./search";
import { DocsWrapper } from "./docs";

interface MdbDoc {
  // database document id
  _id: ObjectID;

  // human readable id, never changes
  friendlyId: string;

  // everything in doc subject to edits, revisions
  // in future we will keep a list of these (or diffs)
  // for edit history
  doc: DbDoc;
}

// wrap the mongodb data connection with this class
// track changes to maintain
// 1) text search index
// 2) document graph
// 3) referred-to-by graph
// 4) actual documents ?
export class DbWrapper {
  // If this app is ever scaled to more than one node, it will
  // need to attach to a ChangeStream to keep up to date. for
  // now we are the only process making edits, so update as
  // needed and restart the app if the database is changed from
  // the outside (e.g. by the provisioning script)
  private dbConn: Collection<MdbDoc>;

  // Look up a database docid from a friendly id, only needed
  // when saving an edit to the database
  private dbIdLookup: { [friendlyId: string]: ObjectID };

  // Local cache of all documents, used for most operations
  // and kept up to date
  private localStore: { [friendlyId: string]: DbDoc };

  // Wrappers that process data for the API layer
  private search: SearchWrapper;
  private docs: DocsWrapper;

  private constructor(mdbCollection: Collection<MdbDoc>) {
    this.dbConn = mdbCollection;
  }

  public static async create(mdbCollection: Collection<MdbDoc>): Promise<DbWrapper> {
    const db = new DbWrapper(mdbCollection);
    await db.Initialize();
    return db;
  }

  public getSearch() {
      return this.search;
  }

  public getDocs() {
      return this.docs;
  }

  private async Initialize() {
    this.dbIdLookup = {};
    this.localStore = {};
    const opts: FindOneOptions = {
      projection: {
        _id: true,
        friendlyId: true,
        doc: true
      }
    };
    const all = await this.dbConn.find({}, opts).toArray();
    all.forEach((mdbDoc: MdbDoc) => {
      this.dbIdLookup[mdbDoc.friendlyId] = mdbDoc._id;
      this.localStore[mdbDoc.friendlyId] = mdbDoc.doc;
    });

    this.docs = new DocsWrapper(this.localStore);

    // Note: this will build a lunr index, and may take
    // a few seconds
    this.search = new SearchWrapper(this.localStore);
  }
}
