//定义本模块的业务模型
import /*# =taro?pathToRegexp:{pathToRegexp} #*/ from 'path-to-regexp';
import {BaseModel} from '<%= elux %>';
import {CurrentView} from './entity';

//定义本模块的状态结构
export interface ModuleState {
  currentView?: CurrentView; //该字段用来表示当前路由下展示本模块的哪个View
}

//每个不同的模块都可以在路由中提取自己想要的信息
interface RouteParams {
  currentView?: CurrentView;
}

//定义本模块的业务模型，必需继承BaseModel
//模型中的属性和方法尽量使用非public
export class Model extends BaseModel<ModuleState> {
  protected routeParams!: RouteParams; //保存从当前路由中提取的信息结果

  protected privateActions = this.getPrivateActions({});

  //提取当前路由中的本模块感兴趣的信息
  protected getRouteParams(): RouteParams {
    const {pathname} = this.getRouter().location;
    const [, currentView] = pathToRegexp('/my/:currentView').exec(pathname) || [];
    return {currentView} as RouteParams;
  }

  //每次路由发生变化，都会引起Model的重新挂载(注意，非UI的挂载)
  //在此钩子中必需完成ModuleState的初始赋值，可以异步
  public onMount(): void {
    this.routeParams = this.getRouteParams();
    const {currentView} = this.routeParams;
    const initState: ModuleState = {currentView};
    //_initState是基类BaseModel中内置的一个reducer
    this.dispatch(this.privateActions._initState(initState));
  }
}
