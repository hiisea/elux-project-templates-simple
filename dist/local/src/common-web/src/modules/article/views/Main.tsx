//通常模块可以定义一个根视图，根视图中显示什么由模块自行决定，父级不干涉，相当于子路由
/*# if:react #*/
import {FC} from 'react';
/*# else #*/
import {defineComponent} from 'vue';
/*# end #*/
import {/*# =react?Dispatch,:exportView, #*/ Switch, connectStore} from '<%= elux %>';
import ErrorPage from '@/components/ErrorPage';
import {APPState} from '@/Global';
import {CurView, ItemDetail} from '../entity';
import Detail from './Detail';
import Edit from './Edit';
import List from './List';

export interface StoreProps {
  curView?: CurView;
  itemDetail?: ItemDetail;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {curView, itemDetail} = appState.article!;
  return {curView, itemDetail};
}

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

//connectRedux中包含了exportView()的执行
export default connectStore(mapStateToProps)(Component);
/*# else #*/
const Component = defineComponent({
  name: 'ArticleMain',
  setup() {
    const storeProps = connectStore(mapStateToProps);

    return () => {
      const {curView, itemDetail, dispatch} = storeProps;
      return (
        <Switch elseView={<ErrorPage />}>
          {curView === 'list' && <List />}
          {curView === 'detail' && <Detail itemDetail={itemDetail/*# =post?!: #*/} />}
          {curView === 'edit' && <Edit itemDetail={itemDetail/*# =post?!: #*/} dispatch={dispatch} />}
        </Switch>
      );
    };
  },
});

export default exportView(Component);
/*# end #*/
