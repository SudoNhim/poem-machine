import * as express from 'express';
import * as path from 'path';
import { MongoClient } from 'mongodb';
import { SERVER_PORT } from './config';
import { apiRouter } from './routes/api-router';
import { pagesRouter } from './routes/pages-router';
import { staticsRouter } from './routes/statics-router';

const mongoClientUrl = "mongodb://localhost/test";
const mongoClient = new MongoClient(mongoClientUrl);
mongoClient.connect().then(client => {
  console.log(`Connected to database at ${mongoClientUrl}`);
  const db = client.db("admin");

  const app = express();
  app.set('view engine', 'ejs');
  
  app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
  app.use('/api', apiRouter(db));
  app.use('/statics', staticsRouter());
  
  // Everything not matched by the above falls through to the app page
  app.use(pagesRouter());
  
  app.listen(SERVER_PORT, () => {
    console.log(`App listening on port ${SERVER_PORT}!`);
  });
})

