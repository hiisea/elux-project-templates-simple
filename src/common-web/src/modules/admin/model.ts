//定义本模块的业务模型
import {APPState} from '@/Global';
import {BaseModel} from '<%= elux %>';
import /*# =taro?pathToRegexp:{pathToRegexp} #*/ from 'path-to-regexp';
import {api, Notices, SubModule} from './entity';

//定义本模块的状态结构
export interface ModuleState {
  subModule?: SubModule; //该字段用来记录当前路由下展示哪个子Module
  notices: Notices; //该字段用来记录实时通知信息
}

//定义路由中的本模块感兴趣的信息
export interface RouteParams {
  subModule?: SubModule;
}

let noticesTimer = 0;

//定义本模块的业务模型，必需继承BaseModel
//模型中的属性和方法尽量使用非public
export class Model extends BaseModel<ModuleState, APPState> {
  protected routeParams!: RouteParams; //保存从当前路由中提取的信息结果

  //因为要尽量避免使用public方法，所以构建this.privateActions来引用私有actions
  protected privateActions = this.getPrivateActions({});

  //提取当前路由中的本模块感兴趣的信息
  protected getRouteParams(): RouteParams {
    const {pathname} = this.getRouter().location;
    const [, , subModuleStr = ''] = pathToRegexp('/:admin/:subModule', undefined, {end: false}).exec(pathname) || [];
    const subModule: SubModule | undefined = SubModule[subModuleStr] || undefined;
    return {subModule};
  }

  //初始化或路由变化时都需要重新挂载Model
  //在此钩子中必需完成ModuleState的初始赋值，可以异步
  public onMount(): void {
    this.routeParams = this.getRouteParams();
    const {subModule} = this.routeParams;
    //getPrevState()可以获取路由跳转前的状态
    const {notices} = this.getPrevState() || {notices: {num: 0}};
    const initState: ModuleState = {subModule, notices};
    //_initState是基类BaseModel中内置的一个reducer
    //this.dispatch是this.store.dispatch的快捷方式
    this.dispatch(this.privateActions._initState(initState));
  }

  //页面被激活(变为显示页面)时调用
  onActive(): void {
    //轮询获取通知
    if (!noticesTimer) {
      noticesTimer = setInterval(() => {
        api.getNotices().then((notices) => {
          this.dispatch(this.privateActions._updateState('updataNotices', {notices}));
        });
      }, 10000);
    }
  }

  //页面被冻结(变为历史快照)时调用
  onInactive(): void {
    //可以清除onActive中的副作用，比如清除计时器
    if (noticesTimer) {
      clearInterval(noticesTimer);
      noticesTimer = 0;
    }
  }
}
