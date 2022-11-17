import {IRequest} from '@/utils/base';

export enum SubModule {
  /*# if:admin #*/
  'article' = 'article',
  /*# end #*/
  'my' = 'my',
}

export interface Notices {
  num: number;
}

export type IGetNotices = IRequest<{}, Notices>;
