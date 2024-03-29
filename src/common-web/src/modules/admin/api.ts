import request from '@/utils/request';
import {IGetNotices} from './entity';

class API {
  public getNotices(): Promise<IGetNotices['Response']> {
    return request.get<IGetNotices['Response']>('/api/session/notices').then((res) => {
      return res.data;
    });
  }
}

export default new API();
