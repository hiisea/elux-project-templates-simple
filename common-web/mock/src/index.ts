import path from 'path';
import logger from 'morgan';
import express, {Request, Response} from 'express';
import sessionRouter from './routes/session';
import articleRouter from './routes/article';

const app = express();

app.use(
  logger('dev', {
    skip(req: Request, res: Response) {
      const contentType = res.getHeader('Content-Type')?.toString() || '';
      return !contentType || contentType.indexOf('application/json') < 0;
    },
  })
);

const allowCrossDomain = function (req: Request, res: Response, next: (err?: Error) => void) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
};
app.use(allowCrossDomain);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '../public')));

app.use('/session', sessionRouter);
app.use('/article', articleRouter);

export = app;
