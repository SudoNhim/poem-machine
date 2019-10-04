import * as express from 'express';
import * as path from 'path';
import { MongoClient } from 'mongodb';
import { SERVER_PORT, MONGODB_STR } from './config';
import { apiRouter } from './routes/api-router';
import { pagesRouter } from './routes/pages-router';
import { staticsRouter } from './routes/statics-router';
import { DbWrapper } from './lib/database';

const mongoClient = new MongoClient(MONGODB_STR);
mongoClient.connect().then(async client => {
  console.log(`Connected to database at ${MONGODB_STR}`);
  const mdb = client.db();
  const mdbdocs = mdb.collection("docs");
  const docsdb = await DbWrapper.create(mdbdocs);

  const app = express();
  app.set('view engine', 'ejs');
  
  app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
  app.use('/api', await apiRouter(docsdb));
  app.use('/statics', staticsRouter());
  
  // Everything not matched by the above falls through to the app page
  app.use(pagesRouter());
  
  app.listen(SERVER_PORT, () => {
    console.log(`App listening on port ${SERVER_PORT}!`);
  });
})

