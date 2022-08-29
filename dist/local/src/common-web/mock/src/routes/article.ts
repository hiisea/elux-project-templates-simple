import {Router} from 'express';
import {IGetList, IGetItem, IDeleteItem, IUpdateItem, ICreateItem} from '@/modules/article/entity';
import {database} from '../database';

type Query<T> = {[K in keyof T]: string};

const router = Router();

router.get('/', function ({query}: {query: Query<IGetList['Request']>}, res, next) {
  const {pageCurrent, keyword} = {
    pageCurrent: parseInt(query.pageCurrent || '1'),
    keyword: query.keyword || '',
  };

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
    list: listData.slice(start, end).map((item) => ({...item, content: ''})),
  };

  setTimeout(() => res.json(result), 500);
});

router.get('/:id', function ({params}: {params: IGetItem['Request']}, res, next) {
  const {id} = params;
  const item = database.articles[id];
  if (!item) {
    res.status(404).end();
  } else {
    const result: IGetItem['Response'] = {...item};
    setTimeout(() => res.json(result), 500);
  }
});

router.delete('/:id', function ({params}: {params: {id: string}}, res, next) {
  const {id} = params;
  const item = database.articles[id];
  if (!item) {
    res.status(404).end();
  } else {
    delete database.articles[id];
    const result: IDeleteItem['Response'] = {id};
    setTimeout(() => res.json(result), 500);
  }
});

router.put('/:id', function ({params, body}: {params: {id: string}; body: IUpdateItem['Request']}, res, next) {
  const {id} = params;
  const {title, summary, content} = body;
  const item = database.articles[id];
  if (!item) {
    res.status(404).end();
  } else {
    database.articles[id] = {id, title, summary, content};
    const result: IUpdateItem['Response'] = {id};
    setTimeout(() => res.json(result), 500);
  }
});

router.post('/', function ({body}: {body: ICreateItem['Request']}, res, next) {
  const {title, summary, content} = body;
  const id = 'n' + Object.keys(database.articles).length;
  database.articles[id] = {id, title, summary, content};
  const result: ICreateItem['Response'] = {id};
  setTimeout(() => res.json(result), 500);
});

export default router;
