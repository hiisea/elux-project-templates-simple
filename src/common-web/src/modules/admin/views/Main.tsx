//通常模块可以定义一个根视图，根视图中显示什么由模块自行决定，父级不干涉，相当于子路由
/*# if:react #*/
import {Switch, connectRedux} from '<%= elux %>';
import {FC} from 'react';
import {APPState, LoadComponent} from '@/Global';
import {CurUser} from '@/modules/stage/entity';
import {SubModule} from '../entity';
/*# else #*/
import {Switch, exportView} from '<%= elux %>';
import {computed, defineComponent} from 'vue';
import {LoadComponent, useStore} from '@/Global';
/*# end #*/
import ErrorPage from '@/components/ErrorPage';

//采用LoadComponent来加载视图，可以懒执行，并自动初始化与之对应的model
const My = LoadComponent('my', 'main');

/*# if:react #*/
export interface StoreProps {
  curUser: CurUser;
  subModule?: SubModule;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {curUser} = appState.stage!;
  const {subModule} = appState.admin!;
  return {curUser, subModule};
}

/*# end #*/
/*# if:react #*/
const Component: FC<StoreProps> = ({curUser, subModule}) => {
  if (!curUser.hasLogin) {
    return null;
  }
  return (
    <Switch elseView={<ErrorPage />}>
      {subModule === 'my' && <My />}
    </Switch>
  );
};

//connectRedux中包含了exportView()的执行
export default connectRedux(mapStateToProps)(Component);
/*# else #*/
const Component = defineComponent({
  name: 'AdminMain',
  setup() {
    const store = useStore();
    const subModule = computed(() => store.state.admin!.subModule);
    const curUser = computed(() => store.state.stage!.curUser);

    return () => {
      if (!curUser.value.hasLogin) {
        return null;
      }
      return (
        <Switch elseView={<ErrorPage />}>
          {subModule.value === 'my' && <My />}
        </Switch>
      );
    };
  },
});

export default exportView(Component);
/*# end #*/
