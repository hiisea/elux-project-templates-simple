import Taro from '@tarojs/taro';
import {ApiPrefix} from '@/Global';
import {CommonErrorCode, CustomError} from './errors';

export interface IRequest<Req, Res> {
  Request: Req;
  Response: Res;
}

function mapHttpErrorCode(code: string): CommonErrorCode {
  const HttpErrorCode = {
    '401': CommonErrorCode.unauthorized,
    '403': CommonErrorCode.forbidden,
    '404': CommonErrorCode.notFound,
  };
  return HttpErrorCode[code] || CommonErrorCode.unkown;
}

function successHandler(res: any) {
  if (res.statusCode === 200 || res.statusCode === 201) {
    return res;
  }
  throw res;
}

function errorHandler(res: {url: string; statusCode?: number; status?: number; statusText?: string; data?: any; json: () => Promise<any>}) {
  const httpErrorCode = res.statusCode || res.status || 0;
  const statusText = res.statusText || '接口请求错误';
  const unknownMessage = `${statusText}, failed to call ${res.url}`;
  const detail: Promise<any> = res.json ? res.json() : Promise.resolve(res.data || {});
  return detail.then(
    (detail) => {
      const errorMessage = detail.message || unknownMessage;
      throw new CustomError(mapHttpErrorCode(httpErrorCode.toString()), errorMessage, detail);
    },
    () => {
      throw new CustomError(CommonErrorCode.unkown, unknownMessage);
    }
  );
}

const request = {
  get<T = any>(url: string, data: {params?: any} = {}): Promise<{data: T}> {
    return Taro.request<T>({url: url.replace('/api/', ApiPrefix), method: 'GET', data: data.params})
      .then(successHandler)
      .catch(errorHandler);
  },
  delete<T = any>(url: string, data?: any): Promise<{data: T}> {
    return Taro.request<T>({url: url.replace('/api/', ApiPrefix), method: 'DELETE', data})
      .then(successHandler)
      .catch(errorHandler);
  },
  put<T = any>(url: string, data?: any): Promise<{data: T}> {
    return Taro.request<T>({url: url.replace('/api/', ApiPrefix), method: 'PUT', data})
      .then(successHandler)
      .catch(errorHandler);
  },
  post<T = any>(url: string, data?: any): Promise<{data: T}> {
    return Taro.request<T>({url: url.replace('/api/', ApiPrefix), method: 'POST', data})
      .then(successHandler)
      .catch(errorHandler);
  },
};

export default request;
