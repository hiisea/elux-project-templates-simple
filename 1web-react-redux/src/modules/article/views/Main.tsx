import React from 'react';
import {Dispatch, connectRedux} from '@elux/react-redux-web';
import {APPState, RouteParams} from '@/Global';
import List from './List';
import Detail from './Detail';
import Edit from './Edit';
import {ListView, ItemView, ItemDetail} from '../entity';

export interface StoreProps {
  listView?: ListView;
  itemView?: ItemView;
  itemDetail?: ItemDetail;
}

function mapStateToProps(appState: APPState): StoreProps {
  const routeParams: RouteParams = appState.route.params;
  const {listView, itemView} = routeParams.article || {};
  const {itemDetail} = appState.article;
  return {listView, itemView, itemDetail};
}

const Component: React.FC<StoreProps & {dispatch: Dispatch}> = ({listView, itemView, itemDetail, dispatch}) => {
  return (
    <>
      {listView === 'list' && <List />}
      {itemView === 'detail' && itemDetail && <Detail itemDetail={itemDetail} />}
      {itemView === 'edit' && itemDetail && <Edit itemDetail={itemDetail} dispatch={dispatch} />}
    </>
  );
};

export default connectRedux(mapStateToProps)(Component);
