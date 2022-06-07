//通常模块可以定义一个根视图，根视图中显示什么由模块自行决定，父级不干涉，相当于子路由
import ErrorPage from '@/components/ErrorPage';
import {APPState/*# =vue?, useStore: #*/} from '@/Global';
/*# if:react #*/
import {connectRedux, Dispatch, Switch} from '<%= elux %>';
/*# else:vue #*/
import {ComputedStore, exportView, Switch} from '<%= elux %>';
/*# end #*/
/*# if:react #*/
import {FC} from 'react';
/*# else:vue #*/
import {computed, defineComponent} from 'vue';
/*# end #*/
import {CurView, ItemDetail} from '../entity';
import Detail from './Detail';
import Edit from './Edit';
import List from './List';

export interface StoreProps {
  curView?: CurView;
  itemDetail?: ItemDetail;
}

/*# if:react #*/
function mapStateToProps(appState: APPState): StoreProps {
  const {curView, itemDetail} = appState.article!;
  return {curView, itemDetail};
}
/*# else:vue #*/
//这里保持Redux的风格一致，也可以省去这一步，直接使用computed
function mapStateToProps(appState: APPState): ComputedStore<StoreProps> {
  const article = appState.article!;
  return {
    curView: () => article.curView,
    itemDetail: () => article.itemDetail,
  };
}
/*# end #*/

/*# if:react #*/
const Component: FC<StoreProps & {dispatch: Dispatch}> = ({curView, itemDetail, dispatch}) => {
  return (
    <Switch elseView={<ErrorPage />}>
      {curView === 'list' && <List />}
      {curView === 'detail' && <Detail itemDetail={itemDetail/*# =post?!: #*/} />}
      {curView === 'edit' && <Edit itemDetail={itemDetail/*# =post?!: #*/} dispatch={dispatch} />}
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
    const curView = computed(computedStore.curView);
    const itemDetail = computed(computedStore.itemDetail);
    return () => (
      <Switch elseView={<ErrorPage />}>
        {curView.value === 'list' && <List />}
        {curView.value === 'detail' && <Detail itemDetail={itemDetail.value/*# =post?!: #*/} />}
        {curView.value === 'edit' && <Edit itemDetail={itemDetail.value/*# =post?!: #*/} dispatch={store.dispatch} />}
      </Switch>
    );
  },
});

export default exportView(Component);
/*# end #*/
