//定义本模块的业务模型
import /*# =taro?pathToRegexp:{pathToRegexp} #*/ from 'path-to-regexp';
/*# if:taro #*/
import {showToast} from '@tarojs/taro';
/*# end #*/
import {BaseModel, ErrorCodes, LoadingState, effect, reducer} from '<%= elux %>';
import {APPState} from '@/Global';
import {HomeUrl, LoginUrl} from '@/utils/const';
import {CustomError, CommonErrorCode} from '@/utils/errors';
import {CurUser, CurrentModule, CurrentView, LoginParams, guest, api} from './entity';

//定义本模块的状态结构
export interface ModuleState {
  curUser: CurUser;
  //该字段用来记录当前路由下展示哪个相应的模块，比如以/article/xxx为前缀的路由展示article模块，
  //具体展示article模块下的哪个View，应当由article模块自行决定
  currentModule?: CurrentModule;
  currentView?: CurrentView; //该字段用来表示当前路由下展示本模块的哪个View
  globalLoading?: LoadingState; //该字段用来记录全局的loading状态
  error?: string; //该字段用来记录应用的启动错误，如果出现启动错误，则提示该错误，并不渲染任何有效的View
}

//定义本模块在路由中提取的信息，每个不同的模块都可以在路由中提取自己想要的信息
//具体哪些信息，怎么提取都由模块自己决定
export interface RouteParams {
  currentModule?: CurrentModule;
  currentView?: CurrentView;
}

//定义本模块的业务模型，必需继承BaseModel
//模型中的属性和方法尽量使用非public
export class Model extends BaseModel<ModuleState, APPState> {
  protected routeParams!: RouteParams; //保存从当前路由中提取的信息结果

  //构建私有actions生成器，因为要尽量避免使用public方法，所以this.actions也引用不到私有actions
  protected privateActions = this.getPrivateActions({putCurUser: this.putCurUser});

  //提取当前路由中的本模块感兴趣的信息
  protected getRouteParams(): RouteParams {
    const {pathname} = this.getRouter().location;
    const [, currentModule, currentView] = pathToRegexp('/:currentModule/:currentView').exec(pathname) || [];
    return {currentModule, currentView} as RouteParams;
  }

  //每次路由发生变化，都会引起Model的重新挂载(注意，非UI的挂载)
  //在此钩子中必需完成ModuleState的初始赋值，可以异步
  //在此钩子执行完成之前，UI将不会Render具体内容，仅显示loading
  //在此钩子中并可以await子模块挂载，这样等所有子模块都挂载完成后，一次性RenderUI
  //也可以不等待子模块挂载，这样子模块可能需要自己展示中间状态，这样就形成了2种不同的路由风格：
  //一种是数据前置，路由后置(所有数据全部都准备好了再跳转)；一种是路由前置，数据后置(路由先跳转，然后开始初始化和数据loading)
  //SSR时只能使用"路由后置"风格
  public async onMount(env: 'init' | 'route' | 'update'): Promise<void> {
    this.routeParams = this.getRouteParams();
    const {currentModule, currentView} = this.routeParams;
    const {curUser: _curUser} = this.getPrevState() || {};
    try {
      const curUser = _curUser || (await api.getCurUser());
      const initState: ModuleState = {curUser, currentModule, currentView};
      //_initState是基类BaseModel中内置的一个reducer
      this.dispatch(this.privateActions._initState(initState));
      /*# if:post #*/
      if (currentModule && currentModule !== 'stage') {
        await this.store.mount(currentModule, env);
      }
      /*# end #*/
    } catch (err: any) {
      //如果根模块初始化中出现任何错误，渲染UI将变得没有实际意义
      const initState: ModuleState = {curUser: {...guest}, currentModule, currentView, error: err.message || err.toString()};
      //_initState是基类BaseModel中内置的一个reducer
      this.dispatch(this.privateActions._initState(initState));
    }
  }

  //定义一个reducer，用来更新当前用户状态
  @reducer
  protected putCurUser(curUser: CurUser): /*# =react?ModuleState:void #*/ {
    /*# if:react #*/
    return {...this.state, curUser};
    /*# else #*/
    Object.assign(this.state, {curUser});
    /*# end #*/
  }

  //定义一个effect，用来执行登录逻辑
  //effect(参数)，参数可以用来将该effect的执行进度注入指定的ModuleState中，如effect('this.loginLoading')
  //effect()参数为空，默认等于effect('stage.globalLoading')，表示将该effect的执行进度注入stage模块的globalLoading状态中
  //如果不需要跟踪该effect的执行进度，请使用effect(null)
  @effect()
  public async login(args: LoginParams): Promise<void> {
    const curUser = await api.login(args);
    this.dispatch(this.privateActions.putCurUser(curUser));
    const fromUrl: string = this.getRouter().location.searchQuery.from || HomeUrl;
    //用户登录后清空所有路由栈，并跳回原地
    this.getRouter().relaunch({url: fromUrl}, 'window');
  }

  @effect()
  public async logout(): Promise<void> {
    const curUser = await api.logout();
    this.dispatch(this.privateActions.putCurUser(curUser));
    //用户登出后清空所有路由栈，并跳首页
    this.getRouter().relaunch({url: HomeUrl}, 'window');
  }

  //相当于Action中的try-catch，在ActionHandler运行中的出现的任何错误都会自动dispatch一个type为'stage._error'的Action
  //可以通过effect来监听这个Action，并决定如何提示用户和是否继续抛出此错误
  //如果继续抛出，则整个ActionBus链将终止执行，否则你将想办法消化这个错误
  //注意如果继续抛出，请抛出原错误，不要创建新的错误，以防止无穷递归
  @effect(null)
  protected async ['this._error'](error: CustomError): Promise<void> {
    if (error.code === CommonErrorCode.unauthorized) {
      this.getRouter().push({pathname: LoginUrl, searchQuery: {from: error.detail}}, 'window');
    } else if (!error.quiet && error.code !== ErrorCodes.ROUTE_BACK_OVERFLOW) {
      // ErrorCodes.ROUTE_BACK_OVERFLOW是路由后退溢出时抛出的错误，默认会回到首页，所以无需处理
      // eslint-disable-next-line no-alert
      /*# if:ssr #*/
      //SSR时server端没有window对象，不需要alert
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

  //支持路由守卫
  //路由跳转前会dispatch一个type为'stage._testRouteChange'的Action
  //可以通过effect来监听这个Action，并决定是否阻止，如果想阻止跳转，可以抛出一个错误
  @effect(null)
  protected async ['this._testRouteChange']({pathname}: {pathname: string}): Promise<void> {
    if (pathname.startsWith('/my/') && !this.state.curUser.hasLogin) {
      throw new CustomError(CommonErrorCode.unauthorized, '请登录！', pathname, true);
    }
  }
  /*# end #*/
}
