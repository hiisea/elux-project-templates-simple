import request from '@/utils/request';
import {IGetCurUser, ILogin, ILogout, guest} from './entity';


class API {
  public getCurUser(): Promise<IGetCurUser['Response']> {
    return request
      .get<IGetCurUser['Response']>('/api/session')
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return guest;
      });
  }
  public login(params: ILogin['Request']): Promise<ILogin['Response']> {
    return request.put<ILogin['Response']>('/api/session', params).then((res) => {
      localStorage.setItem('token', res.data.id + res.data.username);
      return res.data;
    });
  }

  public logout(): Promise<ILogout['Response']> {
    return request.delete<ILogout['Response']>('/api/session').then((res) => {
      localStorage.removeItem('token');
      return res.data;
    });
  }
}

export default new API();
