//定义本模块的业务模型
import /*# =taro?pathToRegexp:{pathToRegexp} #*/ from 'path-to-regexp';
import {BaseModel, reducer, effect} from '<%= elux %>';
import {APPState} from '@/Global';
import {mergeDefaultParams} from '@/utils/tools';
import {CurrentView, ListSearch, ListItem, ListSummary, ItemDetail, defaultListSearch, api} from './entity';

//定义本模块的状态结构
//通常都是`列表/详情/编辑`结构
export interface ModuleState {
  currentView?: CurrentView; //该字段用来表示当前路由下展示本模块的哪个View
  listSearch?: ListSearch; //该字段用来记录列表时搜索条件
  list?: ListItem[]; //该字段用来记录列表
  listSummary?: ListSummary; //该字段用来记录当前列表的摘要信息
  itemId?: string; //该字段用来记录某条记录的ID
  itemDetail?: ItemDetail; //该字段用来记录某条记录的详情
}

//每个不同的模块都可以在路由中提取自己想要的信息
interface RouteParams {
  currentView?: CurrentView;
  listSearch: ListSearch;
  itemId?: string;
}

//定义本模块的业务模型，必需继承BaseModel
//模型中的属性和方法尽量使用非public
export class Model extends BaseModel<ModuleState, APPState> {
  protected routeParams!: RouteParams; //保存从当前路由中提取的信息结果

  //构建私有actions生成器，因为要尽量避免使用public方法，所以this.actions也引用不到私有actions
  protected privateActions = this.getPrivateActions({putList: this.putList, putCurrentItem: this.putCurrentItem});

  //提取当前路由中的本模块感兴趣的信息
  protected getRouteParams(): RouteParams {
    const {pathname, searchQuery} = this.getRouter().location;
    const [, currentView] = pathToRegexp('/article/:currentView').exec(pathname) || [];
    const {pageCurrent = '', keyword, id} = searchQuery as Record<string, string | undefined>;
    const listSearch = {pageCurrent: parseInt(pageCurrent) || undefined, keyword};
    return {currentView: currentView as CurrentView, itemId: id, listSearch: mergeDefaultParams(defaultListSearch, listSearch)};
  }

  //每次路由发生变化，都会引起Model的重新挂载(注意，非UI的挂载)
  //在此钩子中必需完成ModuleState的初始赋值，可以异步
  //在此钩子执行完成之前，UI将不会Render具体内容，仅显示loading
  //在此钩子中并可以await数据请求，这样等所有数据拉取回来后，一次性Render
  //也可以不等待数据拉取，先Render界面(loading中)
  public /*# =post?async : #*/onMount(env: 'init' | 'route' | 'update'): /*# =post?Promise<void>:void #*/ {
    this.routeParams = this.getRouteParams();
    /*# if:ssr #*/
    const prevState = this.getPrevState();
    //如果是SSR，client直接使用server的state即可
    if (env === 'init' && prevState) {
      this.dispatch(this.privateActions._initState(prevState));
      return;
    }
    /*# end #*/
    const {currentView, listSearch, itemId} = this.routeParams;
    this.dispatch(this.privateActions._initState({currentView}));
    if (currentView === 'list') {
      /*# =post?await : #*/this.dispatch(this.actions.fetchList(listSearch));
    } else if (currentView && itemId) {
      /*# =post?await : #*/this.dispatch(this.actions.fetchItem(itemId));
    }
  }

  //定义一个reducer，用来更新列表数据
  @reducer
  protected putList(listSearch: ListSearch, list: ListItem[], listSummary: ListSummary): /*# =react?ModuleState:void #*/ {
    /*# if:react #*/
    return {...this.state, listSearch, list, listSummary};
    /*# else #*/
    Object.assign(this.state, {listSearch, list, listSummary});
    /*# end #*/
  }

  //定义一个reducer，用来更新详情数据
  @reducer
  protected putCurrentItem(itemId: string, itemDetail: ItemDetail): /*# =react?ModuleState:void #*/ {
    /*# if:react #*/
    return {...this.state, itemId, itemDetail};
    /*# else #*/
    Object.assign(this.state, {itemId, itemDetail});
    /*# end #*/
  }

  //定义一个effect，用来执行删除的业务逻辑
  //effect()未加参数，默认等于effect('stage.globalLoading')，表示将该effect的执行进度注入stage模块的globalLoading状态中
  //也可以在ModuleState中增加一个loading状态，effect('this.deleteLoading')
  @effect()
  public async deleteItem(id: string): Promise<void> {
    await api.deleteItem({id});
    this.dispatch(this.actions.fetchList());
  }

  //定义一个effect，用来执行修改的业务逻辑
  @effect()
  public async updateItem(item: ItemDetail): Promise<void> {
    const router = this.getRouter();
    await api.updateItem(item);
    await this.getRouter().back(1, 'window');
    router.getCurrentPage().store.dispatch(this.actions.fetchList());
  }

  //定义一个effect，用来执行创建的业务逻辑
  @effect()
  public async createItem(item: ItemDetail): Promise<void> {
    const router = this.getRouter();
    await api.createItem(item);
    await router.back(1, 'window');
    router.replace({pathname: '/article/list', searchQuery: {pageCurrent: 1}});
  }

  //定义一个effect，用来执行列表查询的业务逻辑
  @effect()
  public async fetchList(listSearchData?: ListSearch): Promise<void> {
    const listSearch = listSearchData || this.state.listSearch || defaultListSearch;
    const {list, listSummary} = await api.getList(listSearch);
    this.dispatch(this.privateActions.putList(listSearch, list, listSummary));
  }

  //定义一个effect，用来执行获取详情的业务逻辑
  @effect()
  public async fetchItem(itemId: string): Promise<void> {
    const item = await api.getItem({id: itemId});
    this.dispatch(this.privateActions.putCurrentItem(itemId, item));
  }
}
