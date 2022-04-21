import {pathToRegexp} from 'path-to-regexp';
import {BaseModel, reducer, effect} from '<%= elux %>';
import {APPState} from '@/Global';
import {mergeDefaultParams} from '@/utils/tools';
import {CurrentView, ListSearch, ListItem, ListSummary, ItemDetail, defaultListSearch, api} from './entity';

export interface ModuleState {
  currentView?: CurrentView;
  listSearch?: ListSearch;
  list?: ListItem[];
  listSummary?: ListSummary;
  itemId?: string;
  itemDetail?: ItemDetail;
}

interface RouteParams {
  currentView?: CurrentView;
  listSearch: ListSearch;
  itemId?: string;
}

export class Model extends BaseModel<ModuleState, APPState> {
  protected declare routeParams: RouteParams;
  protected privateActions = this.getPrivateActions({putList: this.putList, putCurrentItem: this.putCurrentItem});

  protected getRouteParams(): RouteParams {
    const {pathname, searchQuery} = this.getRouter().location;
    const [, currentView] = pathToRegexp('/article/:currentView').exec(pathname) || [];
    const {pageCurrent = '', keyword, id} = searchQuery as Record<string, string | undefined>;
    const listSearch = {pageCurrent: parseInt(pageCurrent) || undefined, keyword};
    return {currentView: currentView as CurrentView, itemId: id, listSearch: mergeDefaultParams(defaultListSearch, listSearch)};
  }

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

  @reducer
  protected putList(listSearch: ListSearch, list: ListItem[], listSummary: ListSummary): /*# =react?ModuleState:void #*/ {
    /*# if:react #*/
    return {...this.state, listSearch, list, listSummary};
    /*# else #*/
    Object.assign(this.state, {listSearch, list, listSummary});
    /*# end #*/
  }

  @reducer
  protected putCurrentItem(itemId: string, itemDetail: ItemDetail): /*# =react?ModuleState:void #*/ {
    /*# if:react #*/
    return {...this.state, itemId, itemDetail};
    /*# else #*/
    Object.assign(this.state, {itemId, itemDetail});
    /*# end #*/
  }

  @effect()
  public async deleteItem(id: string): Promise<void> {
    await api.deleteItem({id});
    this.dispatch(this.actions.fetchList());
  }

  @effect()
  public async updateItem(item: ItemDetail): Promise<void> {
    const router = this.getRouter();
    await api.updateItem(item);
    await this.getRouter().back(1, 'window');
    router.getCurrentPage().store.dispatch(this.actions.fetchList());
  }

  @effect()
  public async createItem(item: ItemDetail): Promise<void> {
    const router = this.getRouter();
    await api.createItem(item);
    await router.back(1, 'window');
    router.replace({pathname: '/article/list', searchQuery: {pageCurrent: 1}});
  }

  @effect()
  public async fetchList(listSearchData?: ListSearch): Promise<void> {
    const listSearch = listSearchData || this.state.listSearch || defaultListSearch;
    const {list, listSummary} = await api.getList(listSearch);
    this.dispatch(this.privateActions.putList(listSearch, list, listSummary));
  }

  @effect()
  public async fetchItem(itemId: string): Promise<void> {
    const item = await api.getItem({id: itemId});
    this.dispatch(this.privateActions.putCurrentItem(itemId, item));
  }
}
