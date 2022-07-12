//通常模块可以定义一个根视图，根视图中显示什么由模块自行决定，父级不干涉，相当于子路由
import ErrorPage from '@/components/ErrorPage';
import {APPState, LoadComponent/*# =vue?, useStore: #*/} from '@/Global';
import {CurUser} from '@/modules/stage/entity';
/*# if:react #*/
import {connectRedux, Switch} from '<%= elux %>';
import {FC} from 'react';
/*# else:vue #*/
import {ComputedStore, exportView, Switch} from '<%= elux %>';
import {computed, defineComponent} from 'vue';
/*# end #*/
import {SubModule} from '../entity';

//采用LoadComponent来加载视图，可以懒执行，并自动初始化与之对应的model
const My = LoadComponent('my', 'main');

export interface StoreProps {
  curUser: CurUser;
  subModule?: SubModule;
}

/*# if:react #*/
function mapStateToProps(appState: APPState): StoreProps {
  const {curUser} = appState.stage!;
  const {subModule} = appState.admin!;
  return {curUser, subModule};
}
/*# else:vue #*/
//这里保持和Redux的风格一致，也可以省去这一步，直接使用computed
function mapStateToProps(appState: APPState): ComputedStore<StoreProps> {
  const stage = appState.stage!;
  const admin = appState.admin!;
  return {
    curUser: () => stage.curUser,
    subModule: () => admin.subModule,
  };
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
/*# else:vue #*/
const Component = defineComponent({
  name: 'AdminMain',
  setup() {
    const store = useStore();
    const computedStore = mapStateToProps(store.getState());
    const subModule = computed(computedStore.subModule);
    const curUser = computed(computedStore.curUser);

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
