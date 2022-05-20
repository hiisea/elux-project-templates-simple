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
  currentModule?: CurrentModule;//该字段用来记录当前路由下展示哪个子Module
  currentView?: CurrentView; //该字段用来记录当前路由下展示本模块的哪个View
  globalLoading?: LoadingState; //该字段用来记录一个全局的loading状态
  error?: string; //该字段用来记录启动错误，如果该字段有值，则不渲染其它UI
}

//定义路由中的本模块感兴趣的信息
export interface RouteParams {
  currentModule?: CurrentModule;
  currentView?: CurrentView;
}

//定义本模块的业务模型，必需继承BaseModel
//模型中的属性和方法尽量使用非public
export class Model extends BaseModel<ModuleState, APPState> {
  protected routeParams!: RouteParams; //保存从当前路由中提取的信息结果

  //因为要尽量避免使用public方法，所以构建this.privateActions来引用私有actions
  protected privateActions = this.getPrivateActions({putCurUser: this.putCurUser});

  //提取当前路由中的本模块感兴趣的信息
  protected getRouteParams(): RouteParams {
    const {pathname} = this.getRouter().location;
    const [, currentModule, currentView] = pathToRegexp('/:currentModule/:currentView').exec(pathname) || [];
    return {currentModule, currentView} as RouteParams;
  }
  
  //每次路由发生变化，都会引起Model重新挂载到Store
  //在此钩子中必需完成ModuleState的初始赋值，可以异步
  //在此钩子执行完成之前，本模块的View将不会Render
  //在此钩子中可以await数据请求，这样等所有数据拉取回来后，一次性Render
  //在此钩子中也可以await子模块的mount，这样等所有子模块都挂载好了，一次性Render
  //也可以不做任何await，直接Render，此时需要设计Loading界面
  //这样也形成了2种不同的路由风格：
  //一种是数据前置，路由后置(所有数据全部都准备好了再跳转、展示界面)
  //一种是路由前置，数据后置(路由先跳转，展示设计好的loading界面)
  //SSR时只能使用"数据前置"风格
  public async onMount(env: 'init' | 'route' | 'update'): Promise<void> {
    this.routeParams = this.getRouteParams();
    const {currentModule, currentView} = this.routeParams;
    //getPrevState()可以获取路由跳转前的状态
    //以下意思是：如果curUser已经存在(之前获取过了)，就直接使用，不再调用API获取
    //你也可以利用这个方法，复用路由之前的任何有效状态，从而减少数据请求
    const {curUser: _curUser} = this.getPrevState() || {};
    try {
      //如果用户信息不存在(第一次)，等待获取当前用户信息
      const curUser = _curUser || (await api.getCurUser());
      const initState: ModuleState = {curUser, currentModule, currentView};
      //_initState是基类BaseModel中内置的一个reducer
      //this.dispatch是this.store.dispatch的快捷方式
      //以下语句等于this.store.dispatch({type: 'stage._initState', payload: initState})
      this.dispatch(this.privateActions._initState(initState));
      /*# if:post #*/
      if (currentModule && currentModule !== 'stage') {
        await this.store.mount(currentModule, env);
      }
      /*# end #*/
    } catch (err: any) {
      //如果根模块初始化中出现错误，将错误放入ModuleState.error字段中，此时将展示该错误信息
      const initState: ModuleState = {curUser: {...guest}, currentModule, currentView, error: err.message || err.toString()};
      this.dispatch(this.privateActions._initState(initState));
    }
  }

  //定义一个reducer，用来更新当前用户状态
  //注意该render不希望对外输出，所以定义为protected
  @reducer
  protected putCurUser(curUser: CurUser): /*# =react?ModuleState:void #*/ {
    /*# if:react #*/
    return {...this.state, curUser};
    /*# else #*/
    Object.assign(this.state, {curUser});
    /*# end #*/
  }

  //定义一个effect，用来执行登录逻辑
  //effect(参数)，参数可以用来将该effect的执行进度注入ModuleState中，如effect('this.loginLoading')
  //effect()参数为空，默认等于effect('stage.globalLoading')，表示将执行进度注入stage模块的globalLoading状态中
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

  //ActionHandler运行中的出现的任何错误都会自动派发'stage._error'的Action
  //可以通过effect来监听这个Action，用来处理错误，
  //如果继续抛出错误，则Action停止继续传播，Handler链条将终止执行
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
  //路由跳转前会自动派发'stage._testRouteChange'的Action
  //可以通过effect来监听这个Action，并决定是否阻止，如果想阻止跳转，可以抛出一个错误
  @effect(null)
  protected async ['this._testRouteChange']({pathname}: {pathname: string}): Promise<void> {
    if (pathname.startsWith('/my/') && !this.state.curUser.hasLogin) {
      throw new CustomError(CommonErrorCode.unauthorized, '请登录！', pathname, true);
    }
  }
  /*# end #*/

  //页面被激活(变为显示页面)时调用
  onActive(){
    //可以执行一些激活逻辑，比如开启定时器轮询最新数据；
    console.log('page active!')
  }

  //页面被冻结(变为历史快照)时调用
  onInactive(){
    //可以清除onActive中的副作用，比如清除计时器
    console.log('page inactive!')
  }
}
