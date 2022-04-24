import {stringify, parse} from 'query-string';
import {setConfig, AppConfig} from '<%= elux %>';
import './Global';
import {HomeUrl} from '@/utils/const';
import stage from '@/modules/stage';
import article from '@/modules/article';
import my from '@/modules/my';
//分包加载示例，只引入类型
import type {Shop} from '@/modules/shop';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const ModuleGetter = {
  stage: () => stage,
  article: () => article,
  my: () => my,
  shop: () => ({} as Shop),
};

export const appConfig: AppConfig = setConfig({
  ModuleGetter,
  QueryString: {parse, stringify},
  HomeUrl,
  NativePathnameMapping: {
    in(nativePathname) {
      if (nativePathname === '/') {
        nativePathname = '/modules/article/pages/list';
      }
      return nativePathname.replace(/^\/modules\/(\w+)\/pages\//, '/$1/');
    },
    out(internalPathname) {
      return internalPathname.replace(/^\/(\w+)\//, '/modules/$1/pages/');
    },
  },
});

export type IModuleGetter = typeof ModuleGetter;
