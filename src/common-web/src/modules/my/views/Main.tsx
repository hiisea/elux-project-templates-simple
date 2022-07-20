//通常模块可以定义一个根视图，根视图中显示什么由模块自行决定，父级不干涉，相当于子路由
/*# if:react #*/
import {FC} from 'react';
/*# else #*/
import {defineComponent} from 'vue';
/*# end #*/
import {/*# =vue?exportView,: #*/ Switch, connectStore} from '<%= elux %>';
import {APPState} from '@/Global';
import {CurView} from '../entity';
import ErrorPage from '@/components/ErrorPage';
import UserSummary from './UserSummary';

export interface StoreProps {
  curView?: CurView;
}

function mapStateToProps(appState: APPState): StoreProps {
  return {curView: appState.my!.curView};
}

/*# if:react #*/
const Component: FC<StoreProps> = ({curView}) => {
  return <Switch elseView={<ErrorPage />}>{curView === 'userSummary' && <UserSummary />}</Switch>;
};

export default connectStore(mapStateToProps)(Component);
/*# else #*/
const Component = defineComponent({
  name: 'MyMain',
  setup() {
    const storeProps = connectStore(mapStateToProps);

    return () => {
      const {curView} = storeProps;
      return <Switch elseView={<ErrorPage />}>{curView === 'userSummary' && <UserSummary />}</Switch>;
    };
  },
});

export default exportView(Component);
/*# end #*/
