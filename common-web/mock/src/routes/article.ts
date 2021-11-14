import {Router} from 'express';
import {IGetList, IGetItem, IDeleteItem, IUpdateItem, ICreateItem} from '@/modules/article/entity';
import {extractQuery} from '../utils';
import {database} from '../database';

const router = Router();

router.get('/', function (req, res, next) {
  const args = extractQuery({pageCurrent: '', keyword: ''}, req.query);
  const query = {
    pageCurrent: parseInt(args.pageCurrent, 10) || 1,
    keyword: args.keyword,
  };
  const {pageCurrent, keyword} = query;

  const pageSize = 10;
  const start = (pageCurrent - 1) * pageSize;
  const end = start + pageSize;

  const dataMap = database.articles;
  let listData = Object.keys(dataMap)
    .reverse()
    .map((id) => {
      return dataMap[id];
    });

  if (keyword) {
    listData = listData.filter((item) => item.title.includes(keyword));
  }

  const result: IGetList['Response'] = {
    listSummary: {
      pageCurrent,
      pageSize,
      totalItems: listData.length,
      totalPages: Math.ceil(listData.length / pageSize),
    },
    list: listData.slice(start, end),
  };

  res.json(result);
});

router.get('/:id', function (req, res, next) {
  const params = extractQuery({id: ''}, req.params);
  const {id} = params;
  const item = database.articles[id];
  if (!item) {
    res.status(404).end();
  } else {
    const result: IGetItem['Response'] = {...item};
    res.json(result);
  }
});

router.delete('/:id', function (req, res, next) {
  const params = extractQuery({id: ''}, req.params);
  const {id} = params;
  const item = database.articles[id];
  if (!item) {
    res.status(404).end();
  } else {
    delete database.articles[id];
    const result: IDeleteItem['Response'] = {id};
    res.json(result);
  }
});

router.put('/:id', function (req, res, next) {
  const args = extractQuery({id: '', title: '', summary: '', content: ''}, req.body);
  const {id, title, summary, content} = args;
  const item = database.articles[id];
  if (!item) {
    res.status(404).end();
  } else {
    database.articles[id] = {id, title, summary, content};
    const result: IUpdateItem['Response'] = {id};
    res.json(result);
  }
});

router.post('/', function (req, res, next) {
  const args = extractQuery({title: '', summary: '', content: ''}, req.body);
  const {title, summary, content} = args;
  const id = 'n' + Object.keys(database.articles).length;
  database.articles[id] = {id, title, summary, content};
  const result: ICreateItem['Response'] = {id};
  res.json(result);
});
export default router;
