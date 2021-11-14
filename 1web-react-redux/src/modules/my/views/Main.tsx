import React from 'react';
import {connectRedux} from '@elux/react-redux-web';
import {APPState, RouteParams} from '@/Global';
import UserSummary from './UserSummary';
import {SubView} from '../entity';

export interface StoreProps {
  subView?: SubView;
}

function mapStateToProps(appState: APPState): StoreProps {
  const routeParams: RouteParams = appState.route.params;
  return {subView: routeParams.my?.subView};
}

const Component: React.FC<StoreProps> = ({subView}) => {
  return <>{subView === 'userSummary' && <UserSummary />}</>;
};

export default connectRedux(mapStateToProps)(Component);
