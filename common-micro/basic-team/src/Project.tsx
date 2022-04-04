import {stringify, parse} from 'query-string';
import {setConfig, AppConfig, exportModule, exportView, EmptyModel} from '<%= elux %>';
import {HomeUrl} from '@/utils/const';
import stage from '@/modules/stage';

export const MockArticleView = exportView(() => <div>Article</div>);
export const MockMyView = exportView(() => <div>My</div>);

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const ModuleGetter = {
  stage: () => stage,
  article: () => exportModule('article', EmptyModel, {main: MockArticleView}),
  my: () => exportModule('my', EmptyModel, {main: MockMyView}),
};

export const appConfig: AppConfig = setConfig({
  ModuleGetter,
  QueryString: {parse, stringify},
  HomeUrl,
});

export type IModuleGetter = typeof ModuleGetter;
