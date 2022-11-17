import {IGetNotices} from '@/modules/admin/entity';
import {ILogin} from '@/modules/stage/entity';
import {Router} from 'express';
import {adminUser, guestUser} from '../database';

const router = Router();

router.get('/', function (req, res, next) {
  if (req.header('authorization') === '1admin') {
    res.json(adminUser);
  } else {
    res.json({ ...guestUser, id: req.header('origin') ? '0' : '' });
  }
});

router.put('/', function ({body}: {body: ILogin['Request']}, res, next) {
  const {username = '', password = ''} = body;
  if (username === 'admin' && password === '123456') {
    res.json(adminUser);
  } else {
    res.status(422).json({
      message: '用户名或密码错误！',
    });
  }
});

router.delete('/', function (req, res, next) {
  res.json(guestUser);
});

router.get('/notices', function (req, res, next) {
  const result: IGetNotices['Response'] = {num: Math.floor(Math.random() * 100)};
  res.json(result);
});

export default router;
