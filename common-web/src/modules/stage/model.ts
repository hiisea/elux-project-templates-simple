import /*# =taro?pathToRegexp:{pathToRegexp} #*/ from 'path-to-regexp';
/*# if:taro #*/
import {showToast} from '@tarojs/taro';
/*# end #*/
import {BaseModel, ErrorCodes, LoadingState, effect, reducer} from '<%= elux %>';
import {APPState} from '@/Global';
import {HomeUrl, LoginUrl} from '@/utils/const';
import {CustomError, CommonErrorCode} from '@/utils/errors';
import {CurUser, CurrentModule, CurrentView, LoginParams, guest, api} from './entity';

export interface ModuleState {
  curUser: CurUser;
  currentModule?: CurrentModule;
  currentView?: CurrentView;
  globalLoading?: LoadingState;
  error?: string;
}

export interface RouteParams {
  currentModule?: CurrentModule;
  currentView?: CurrentView;
}

export class Model extends BaseModel<ModuleState, APPState> {
  protected routeParams: RouteParams;
  protected privateActions = this.getPrivateActions({putCurUser: this.putCurUser});

  protected getRouteParams(): RouteParams {
    const {pathname} = this.getRouter().location;
    const [, currentModule, currentView] = pathToRegexp('/:currentModule/:currentView').exec(pathname) || [];
    return {currentModule, currentView} as RouteParams;
  }

  public async onMount(env: 'init' | 'route' | 'update'): Promise<void> {
    this.routeParams = this.getRouteParams();
    const {currentModule, currentView} = this.routeParams;
    const {curUser: _curUser} = this.getPrevState() || {};
    try {
      const curUser = _curUser || (await api.getCurUser());
      const initState: ModuleState = {curUser, currentModule, currentView};
      this.dispatch(this.privateActions._initState(initState));
      /*# if:post #*/
      if (currentModule && currentModule !== 'stage') {
        await this.store.mount(currentModule, env);
      }
      /*# end #*/
    } catch (err: any) {
      const initState: ModuleState = {curUser: {...guest}, currentModule, currentView, error: err.message || err.toString()};
      this.dispatch(this.privateActions._initState(initState));
    }
  }

  @reducer
  protected putCurUser(curUser: CurUser): /*# =react?ModuleState:void #*/ {
    /*# if:react #*/
    return {...this.state, curUser};
    /*# else #*/
    Object.assign(this.state, {curUser});
    /*# end #*/
  }

  @effect()
  public async login(args: LoginParams): Promise<void> {
    const curUser = await api.login(args);
    this.dispatch(this.privateActions.putCurUser(curUser));
    const fromUrl: string = this.getRouter().location.searchQuery.from || HomeUrl;
    this.getRouter().relaunch({url: fromUrl}, 'window');
  }

  @effect()
  public async logout(): Promise<void> {
    const curUser = await api.logout();
    this.dispatch(this.privateActions.putCurUser(curUser));
    this.getRouter().relaunch({url: HomeUrl}, 'window');
  }

  @effect(null)
  protected async ['this._error'](error: CustomError): Promise<void> {
    //注意错误处理中不要创建并抛出新的错误，以防止无穷递归
    if (error.code === CommonErrorCode.unauthorized) {
      this.getRouter().push({pathname: LoginUrl, searchQuery: {from: error.detail}}, 'window');
    } else if (!error.quiet && error.code !== ErrorCodes.ROUTE_BACK_OVERFLOW) {
      // eslint-disable-next-line no-alert
      /*# if:ssr #*/
      typeof window === 'object' && window.alert(error.message);
      /*# else:taro #*/
      showToast({
        title: error.message,
        icon: 'error',
      });
      /*# else #*/
      window.alert(error.message);
      /*# end #*/
    }
    throw error;
  }
  /*# if:!taro #*/
  
  // 支持路由守卫
  @effect(null)
  protected async ['this._testRouteChange']({pathname}: {pathname: string}): Promise<void> {
    if (pathname.startsWith('/my/') && !this.state.curUser.hasLogin) {
      throw new CustomError(CommonErrorCode.unauthorized, '请登录！', pathname, true);
    }
  }
  /*# end #*/
}
