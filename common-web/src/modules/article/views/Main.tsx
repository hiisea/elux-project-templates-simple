//通常一个模块可以定义一个根模块，相当于子路由，根模块中显示什么由模块自行决定，而非父级决定
/*# if:react #*/
import {FC} from 'react';
/*# else:vue #*/
import {defineComponent, computed} from 'vue';
/*# end #*/
import {Switch, /*# =react?Dispatch, connectRedux:ComputedStore, exportView #*/} from '<%= elux %>';
import {APPState/*# =vue?, useStore: #*/} from '@/Global';
import ErrorPage from '@/components/ErrorPage';
import List from './List';
import Detail from './Detail';
import Edit from './Edit';
import {CurrentView, ItemDetail} from '../entity';

export interface StoreProps {
  currentView?: CurrentView;
  itemDetail?: ItemDetail;
}

/*# if:react #*/
function mapStateToProps(appState: APPState): StoreProps {
  const {currentView, itemDetail} = appState.article!;
  return {currentView, itemDetail};
}
/*# else:vue #*/
function mapStateToProps(appState: APPState): ComputedStore<StoreProps> {
  const article = appState.article!;
  return {
    currentView: () => article.currentView,
    itemDetail: () => article.itemDetail,
  };
}
/*# end #*/

/*# if:react #*/
const Component: FC<StoreProps & {dispatch: Dispatch}> = ({currentView, itemDetail, dispatch}) => {
  return (
    <Switch elseView={<ErrorPage />}>
      {currentView === 'list' && <List />}
      {currentView === 'detail' && <Detail itemDetail={itemDetail/*# =post?!: #*/} />}
      {currentView === 'edit' && <Edit itemDetail={itemDetail/*# =post?!: #*/} dispatch={dispatch} />}
    </Switch>
  );
};

export default connectRedux(mapStateToProps)(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'ArticleMain',
  setup() {
    const store = useStore();
    const computedStore = mapStateToProps(store.getState());
    const currentView = computed(computedStore.currentView);
    const itemDetail = computed(computedStore.itemDetail);
    return () => (
      <Switch elseView={<ErrorPage />}>
        {currentView.value === 'list' && <List />}
        {currentView.value === 'detail' && <Detail itemDetail={itemDetail.value/*# =post?!: #*/} />}
        {currentView.value === 'edit' && <Edit itemDetail={itemDetail.value/*# =post?!: #*/} dispatch={store.dispatch} />}
      </Switch>
    );
  },
});

export default exportView(Component);
/*# end #*/
