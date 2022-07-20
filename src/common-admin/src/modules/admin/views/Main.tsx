//通常模块可以定义一个根视图，根视图中显示什么由模块自行决定，父级不干涉，相当于子路由
/*# if:react #*/
import {FC, useMemo} from 'react';
/*# else #*/
import {computed, defineComponent, DefineComponent} from 'vue';
/*# end #*/
import {/*# =react?Dispatch,:exportView, #*/ connectStore, Switch} from '<%= elux %>';
import {APPState, LoadComponent} from '@/Global';
import ErrorPage from '@/components/ErrorPage';
import {CurUser} from '@/modules/stage/entity';
import {SubModule} from '../entity';
import Layout from './Layout';

//采用LoadComponent来加载视图，可以懒执行，并自动初始化与之对应的model
const My = LoadComponent('my', 'main');
const Article = LoadComponent('article', 'main');

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
    const storeProps = connectStore(mapStateToProps);
    const content = computed(() => {
      const {subModule} = storeProps;
      return (
        <Switch elseView={<ErrorPage />}>
          {subModule === 'article' && <Article />}
          {subModule === 'my' && <My />}
        </Switch>
      );
    });

    return () => {
      const {curUser, dialogMode} = storeProps;
      if (!curUser.hasLogin) {
        return null;
      }
      return dialogMode ? content.value : <Layout>{content.value}</Layout>;
    };
  },
});

export default exportView(Component);
/*# end #*/
