import {API, Facade, getApi} from '<%= elux %>';
import {IModuleGetter} from './Project';

type APP = API<Facade<IModuleGetter>>;

export type APPState = APP['State'];
export type PatchActions = APP['Actions']; // 使用demote命令兼容IE时使用

export const {Modules, LoadComponent, GetActions, GetClientRouter, useStore, useRouter} = getApi<APP>();

export const {StaticPrefix, ApiPrefix} = process.env.PROJ_ENV as {
  StaticPrefix: string;
  ApiPrefix: string;
};
