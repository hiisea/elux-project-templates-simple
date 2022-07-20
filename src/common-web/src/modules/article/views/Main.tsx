//通常模块可以定义一个根视图，根视图中显示什么由模块自行决定，父级不干涉，相当于子路由
/*# if:react #*/
import {Dispatch, Switch, connectStore} from '<%= elux %>';
import {FC} from 'react';
import {APPState} from '@/Global';
import {CurView, ItemDetail} from '../entity';
/*# else #*/
import {Switch, exportView} from '<%= elux %>';
import {computed, defineComponent} from 'vue';
import {useStore} from '@/Global';
/*# end #*/
import ErrorPage from '@/components/ErrorPage';
import Detail from './Detail';
import Edit from './Edit';
import List from './List';

/*# if:react #*/
export interface StoreProps {
  curView?: CurView;
  itemDetail?: ItemDetail;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {curView, itemDetail} = appState.article!;
  return {curView, itemDetail};
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

export default connectStore(mapStateToProps)(Component);
/*# else #*/
const Component = defineComponent({
  name: 'ArticleMain',
  setup() {
    const store = useStore();
    const curView = computed(() => store.state.article!.curView);
    const itemDetail = computed(() => store.state.article!.itemDetail);

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
