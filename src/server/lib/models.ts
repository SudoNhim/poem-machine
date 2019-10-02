export interface DbDoc {
  // type of content, e.g. "song", "album"
  // used to generate the automatic collections
  kind: string;

  // every document must have a title, but it doesn't
  // need to be unique
  title: string;

  // used to populate the tree view, order matters
  children?: string[];

  // document content, stored in markdown
  // special links of the type [](#fid) link to other documents
  text?: string;

  // description also stored in markdown
  description?: string;

  // generic property bag, e.g. for metadata like date,
  // attribution, location...
  props: { [propId: string]: any };
}
