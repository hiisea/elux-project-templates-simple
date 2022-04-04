import {BaseModel, ErrorCodes, LoadingState, effect, reducer} from '<%= elux %>';
import {APPState} from '@/Global';
import {HomeUrl, LoginUrl} from '@/utils/const';
import {CustomError, CommonErrorCode} from '@/utils/errors';
import {CurUser, CurrentView, LoginParams, guest, api} from './entity';

export interface ModuleState {
  curUser: CurUser;
  currentView?: CurrentView;
  globalLoading?: LoadingState;
  error?: string;
}

export interface RouteParams {
  currentView?: CurrentView;
}

export class Model extends BaseModel<ModuleState, APPState> {
  protected declare routeParams: RouteParams;
  protected privateActions = this.getPrivateActions({putCurUser: this.putCurUser});

  protected getRouteParams(): RouteParams {
    const router = this.getRouter();
    const {pathname} = router.location;
    const [, currentView] = pathname.split('/');
    return {currentView} as RouteParams;
  }

  public async onMount(env: 'init' | 'route' | 'update'): Promise<void> {
    this.routeParams = this.getRouteParams();
    const {currentView} = this.routeParams;
    const {curUser: _curUser} = this.getPrevState() || {};
    try {
      const curUser = _curUser || (await api.getCurUser());
      const initState: ModuleState = {curUser, currentView};
      this.dispatch(this.privateActions._initState(initState));
      /*# if:post #*/
      await this.store.mount(currentView as any, env);
      /*# end #*/
    } catch (err: any) {
      const initState: ModuleState = {curUser: {...guest}, currentView, error: err.message || err.toString()};
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
      /*# else #*/
      window.alert(error.message);
      /*# end #*/
    }
    throw error;
  }

  // 支持路由守卫
  @effect(null)
  protected async ['this._testRouteChange']({pathname}: {pathname: string}): Promise<void> {
    if (pathname.startsWith('/my/') && !this.state.curUser.hasLogin) {
      throw new CustomError(CommonErrorCode.unauthorized, '请登录！', pathname, true);
    }
  }
}
