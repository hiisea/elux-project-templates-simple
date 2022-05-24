//该文件可以看作应用的配置文件
import {stringify, parse} from 'query-string';
import {setConfig, AppConfig} from '<%= elux %>';
import {HomeUrl} from '@/utils/const';
import stage from '@/modules/stage';
import admin from '@/modules/admin';
import article from '@/modules/article';
import my from '@/modules/my';
//分包加载示例，只引入类型
import type {Shop} from '@/modules/shop';

//定义模块的获取方式，小程序中不支持import(...)方式异步按需加载
//如果要使用分包加载，请返回一个空的对象，并断言其类型，如以下的`shop`模块
//注意key名必需和模块名保持一致
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const ModuleGetter = {
  //通常stage为根模块，如果根模块要用别的名字，需要同时在以下setConfig中设置
  stage: () => stage,
  //admin充当一个字路由模块，所有此模块下的子模块都需要登录
  admin: () => admin,
  article: () => article,
  my: () => my,
  //该模块使用分包加载，此处返回一个空对象即可
  shop: () => ({} as Shop),
};

//Elux全局设置，参见 https://eluxjs.com/api/react-web.setconfig.html
export const appConfig: AppConfig = setConfig({
  ModuleGetter,
  //Elux并没定死怎么解析路由参数，你可以使用常用的'query-string'或者'json'
  //只需要将parse(解析)和stringify(序列化)方法设置给Elux
  QueryString: {parse, stringify},
  HomeUrl,
  //因为小程序的路由与目录结构是强关联的，此处可以与Elux中的虚拟路由做映射
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
