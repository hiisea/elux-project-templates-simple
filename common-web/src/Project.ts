import {stringify, parse} from 'query-string';
import {setConfig, AppConfig} from '<%= elux %>';
import './Global';
import {HomeUrl} from '@/utils/const';
import stage from '@/modules/stage';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const ModuleGetter = {
  stage: () => stage,
  article: () => import('@/modules/article'),
  my: () => import('@/modules/my'),
};

export const appConfig: AppConfig = setConfig({
  ModuleGetter,
  QueryString: {parse, stringify},
  HomeUrl,
});

export type IModuleGetter = typeof ModuleGetter;
