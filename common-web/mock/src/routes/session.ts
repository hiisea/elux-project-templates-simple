import {Router} from 'express';
import {IGetCurUser} from '@/modules/stage/entity';
import {ILogin, ILogout} from '@/modules/stage/entity';
import {database, adminUser, guestUser} from '../database';

const router = Router();

router.get('/', function (req, res, next) {
  const result: IGetCurUser['Response'] = database.curUser;
  res.json(result);
});

router.put('/', function (req, res, next) {
  const {username = '', password = ''}: ILogin['Request'] = req.body;
  if (username === 'admin' && password === '123456') {
    database.curUser = adminUser;
    const result: ILogin['Response'] = adminUser;
    res.json(result);
  } else {
    res.status(422).json({
      message: '用户名或密码错误！',
    });
  }
});

router.delete('/', function (req, res, next) {
  database.curUser = guestUser;
  const result: ILogout['Response'] = database.curUser;
  res.json(result);
});
export default router;
