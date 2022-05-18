//该文件可以看作应用的配置文件
import {stringify, parse} from 'query-string';
import {setConfig, AppConfig} from '<%= elux %>';
import './Global';
import {HomeUrl} from '@/utils/const';
import stage from '@/modules/stage';

/**
 * 定义模块的获取方式，同步或者异步都可以，配置成异步(import(...))可以按需加载。
 * 注意key名必需和模块名保持一致
 */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const ModuleGetter = {
  //通常stage为根模块，使用同步加载，如果根模块要用别的名字，需要同步在以下setConfig中设置
  stage: () => stage,
  article: () => import('@/modules/article'),
  my: () => import('@/modules/my'),
};

//Elux全局设置，参见 https://eluxjs.com/api/react-web.setconfig.html
export const appConfig: AppConfig = setConfig({
  ModuleGetter,
  /* Elux并没有定死怎么解析路由参数，你可以使用常用的'query-string'或者'json'
   * 你可以将相应的：parse(解析)和stringify(序列化)方法传给Elux
   * 此处使用的是'query-string'方案
   */
  QueryString: {parse, stringify},
  HomeUrl,
});

export type IModuleGetter = typeof ModuleGetter;
