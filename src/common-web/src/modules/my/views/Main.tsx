//通常模块可以定义一个根视图，根视图中显示什么由模块自行决定，父级不干涉，相当于子路由
/*# if:react #*/
import {Switch, connectStore} from '<%= elux %>';
import {FC} from 'react';
import {APPState} from '@/Global';
import {CurView} from '../entity';
/*# else #*/
import {Switch, exportView} from '<%= elux %>';
import {computed, defineComponent} from 'vue';
import {useStore} from '@/Global';
/*# end #*/
import ErrorPage from '@/components/ErrorPage';
import UserSummary from './UserSummary';

/*# if:react #*/
export interface StoreProps {
  curView?: CurView;
}

function mapStateToProps(appState: APPState): StoreProps {
  return {curView: appState.my!.curView};
}

/*# end #*/
/*# if:react #*/
const Component: FC<StoreProps> = ({curView}) => {
  return <Switch elseView={<ErrorPage />}>{curView === 'userSummary' && <UserSummary />}</Switch>;
};

export default connectStore(mapStateToProps)(Component);
/*# else #*/
const Component = defineComponent({
  name: 'MyMain',
  setup() {
    const store = useStore();
    const curView = computed(() => store.state.my!.curView);

    return () => {
      return <Switch elseView={<ErrorPage />}>{curView.value === 'userSummary' && <UserSummary />}</Switch>;
    };
  },
});

export default exportView(Component);
/*# end #*/
