//通常模块可以定义一个根视图，根视图中显示什么由模块自行决定，父级不干涉，相当于子路由
import ErrorPage from '@/components/ErrorPage';
import {APPState/*# =vue?, useStore: #*/} from '@/Global';
/*# if:react #*/
import {connectRedux, Switch} from '<%= elux %>';
/*# else:vue #*/
import {ComputedStore, exportView, Switch} from '<%= elux %>';
/*# end #*/
/*# if:react #*/
import {FC} from 'react';
/*# else:vue #*/
import {computed, defineComponent} from 'vue';
/*# end #*/
import {CurView} from '../entity';
import UserSummary from './UserSummary';

export interface StoreProps {
  curView?: CurView;
}

/*# if:react #*/
function mapStateToProps(appState: APPState): StoreProps {
  return {curView: appState.my!.curView};
}
/*# else:vue #*/
//这里保持和Redux的风格一致，也可以省去这一步，直接使用computed
function mapStateToProps(appState: APPState): ComputedStore<StoreProps> {
  const my = appState.my!;
  return {
    curView: () => my.curView,
  };
}
/*# end #*/

/*# if:react #*/
const Component: FC<StoreProps> = ({curView}) => {
  return <Switch elseView={<ErrorPage />}>{curView === 'userSummary' && <UserSummary />}</Switch>;
};

export default connectRedux(mapStateToProps)(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'MyMain',
  setup() {
    const store = useStore();
    const computedStore = mapStateToProps(store.getState());
    const curView = computed(computedStore.curView);
    return () => {
      return <Switch elseView={<ErrorPage />}>{curView.value === 'userSummary' && <UserSummary />}</Switch>;
    };
  },
});

export default exportView(Component);
/*# end #*/
