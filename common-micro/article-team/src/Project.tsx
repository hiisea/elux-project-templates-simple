//该文件可以看作应用的配置文件
import {stringify, parse} from 'query-string';
import {setConfig, AppConfig, exportModule, exportView, EmptyModel} from '<%= elux %>';
import {HomeUrl} from '@/utils/const';
import stage from '@/modules/stage';

//因为独立开发调试时，需要用到另一个团队开发的`my`这个模块
//但我并不关心这个模块的实现，所以可以模拟一个空的`my`模块
export const MockMyView = exportView(() => <div>My</div>);

/**
 * 定义模块的获取方式，同步或者异步都可以，配置成异步(import(...))可以按需加载。
 * 注意key名必需和模块名保持一致
 */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const ModuleGetter = {
  //通常stage为根模块，使用同步加载，如果根模块要用别的名字，需要同步在以下setConfig中设置
  stage: () => stage,
  article: () => import('@/modules/article'),
  //模拟一个空的`my`模块，以方便调试
  my: () => exportModule('my', EmptyModel, {main: MockMyView}),
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
