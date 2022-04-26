import pathToRegexp from 'path-to-regexp';
import {BaseModel} from '<%= elux %>';
import {CurrentView} from './entity';

export interface ModuleState {
  currentView?: CurrentView;
}

interface RouteParams {
  currentView?: CurrentView;
}

export class Model extends BaseModel<ModuleState> {
  protected routeParams!: RouteParams;
  protected privateActions = this.getPrivateActions({});

  protected getRouteParams(): RouteParams {
    const {pathname} = this.getRouter().location;
    const [, currentView] = pathToRegexp('/shop/:currentView').exec(pathname) || [];
    return {currentView} as RouteParams;
  }

  public onMount(): void {
    this.routeParams = this.getRouteParams();
    const {currentView} = this.routeParams;
    const initState: ModuleState = {currentView};
    this.dispatch(this.privateActions._initState(initState));
  }
}
