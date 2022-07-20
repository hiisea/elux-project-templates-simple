//通常模块可以定义一个根视图，根视图中显示什么由模块自行决定，父级不干涉，相当于子路由
/*# if:react #*/
import {connectStore, Switch} from '<%= elux %>';
import {FC, useMemo} from 'react';
import {APPState, LoadComponent} from '@/Global';
import {CurUser} from '@/modules/stage/entity';
import {SubModule} from '../entity';
/*# else #*/
import {exportView, Switch} from '<%= elux %>';
import {computed, defineComponent, DefineComponent} from 'vue';
import {LoadComponent, useStore} from '@/Global';
/*# end #*/
import ErrorPage from '@/components/ErrorPage';
import Layout from './Layout';

//采用LoadComponent来加载视图，可以懒执行，并自动初始化与之对应的model
const My = LoadComponent('my', 'main');
const Article = LoadComponent('article', 'main');

/*# if:react #*/
export interface StoreProps {
  curUser: CurUser;
  dialogMode: boolean;
  subModule?: SubModule;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {curUser} = appState.stage!;
  const {dialogMode, subModule} = appState.admin!;
  return {curUser, dialogMode, subModule};
}

/*# end #*/
/*# if:react #*/
const Component: FC<StoreProps> = ({curUser, dialogMode, subModule}) => {
  const content = useMemo(
    () => (
      <Switch elseView={<ErrorPage />}>
        {subModule === 'article' && <Article />}
        {subModule === 'my' && <My />}
      </Switch>
    ),
    [subModule]
  );
  if (!curUser.hasLogin) {
    return null;
  }
  return dialogMode ? content : <Layout>{content}</Layout>;
};

//connectRedux中包含了exportView()的执行
export default connectStore(mapStateToProps)(Component);
/*# else:vue #*/
const Component: DefineComponent<{}> = defineComponent({
  name: 'AdminMain',
  setup() {
    const store = useStore();
    const curUser = computed(() => store.state.stage!.curUser);
    const subModule = computed(() => store.state.admin!.subModule);
    const dialogMode = computed(() => store.state.admin!.dialogMode);

    const content = computed(()=>(
      <Switch elseView={<ErrorPage />}>
        {subModule.value === 'article' && <Article />}
        {subModule.value === 'my' && <My />}
      </Switch>
    ))

    return () => {
      if (!curUser.value.hasLogin) {
        return null;
      }
      return dialogMode.value ? content.value : <Layout>{content.value}</Layout>;
    };
  },
});

export default exportView(Component);
/*# end #*/
