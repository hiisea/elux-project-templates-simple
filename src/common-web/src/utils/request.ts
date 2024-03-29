import {isServer} from '<%= elux %>';
import {ApiPrefix} from '@/Global';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {CustomError} from './base';

const instance = axios.create({timeout: 15000});

instance.interceptors.request.use((req) => {
  const token = isServer() ? '' : localStorage.getItem('token');
  return {...req, headers: {Authorization: token}, url: req.url!.replace('/api/', ApiPrefix)};
});

instance.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    return response;
  },
  (error: AxiosError<{message: string}>) => {
    const httpErrorCode = error.response ? error.response.status : 0;
    const statusText = error.response ? error.response.statusText : '';
    const responseData: any = error.response ? error.response.data : '';
    const errorMessage = responseData.message || `${statusText}, failed to call ${error.config.url}`;
    throw new CustomError(httpErrorCode, errorMessage, responseData);
  }
);

export default instance;
