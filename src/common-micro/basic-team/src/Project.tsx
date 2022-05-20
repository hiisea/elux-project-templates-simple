//该文件可以看作应用的配置文件
import {stringify, parse} from 'query-string';
import {setConfig, AppConfig, exportModule, exportView, EmptyModel} from '<%= elux %>';
import {HomeUrl} from '@/utils/const';
import stage from '@/modules/stage';

//`my`和`article`模块由别的Team开发，这里为了调试方便，模拟一个假模块
//也可以直接npm install真实的`my`和`article`模块
export const MockArticleView = exportView(() => <div>Article</div>);
export const MockMyView = exportView(() => <div>My</div>);

//定义模块的获取方式，同步或者异步都可以， 注意key名必需和模块名保持一致
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const ModuleGetter = {
  //通常stage为根模块，使用同步加载。如果根模块要用别的名字，需要同时在以下setConfig中设置
  stage: () => stage,
  //模拟一个空的`article`模块，以便调试
  article: () => exportModule('article', EmptyModel, {main: MockArticleView}),
  //模拟一个空的`my`模块，以便调试
  my: () => exportModule('my', EmptyModel, {main: MockMyView}),
};

//Elux全局设置，参见 https://eluxjs.com/api/react-web.setconfig.html
export const appConfig: AppConfig = setConfig({
  ModuleGetter,
  //Elux并没定死怎么解析路由参数，你可以使用常用的'query-string'或者'json'
  //只需要将parse(解析)和stringify(序列化)方法设置给Elux
  QueryString: {parse, stringify},
  HomeUrl,
});

export type IModuleGetter = typeof ModuleGetter;
