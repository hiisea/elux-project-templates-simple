/*# if:react #*/
import {FC} from 'react';
/*# else:vue #*/
import {defineComponent, computed} from 'vue';
/*# end #*/
import {LoadingState, DocumentHead, Switch, /*# =react?connectRedux:ComputedStore, exportView #*/} from '<%= elux %>';
import {LoadComponent, APPState/*# =vue?, useStore: #*/} from '@/Global';
import LoadingPanel from '@/components/LoadingPanel';
import ErrorPage from '@/components/ErrorPage';
import LoginForm from './LoginForm';
import {CurrentModule, CurrentView} from '../entity';
import '@/assets/css/global.module.less';

//采用LoadComponent来加载视图，可以懒执行，并自动初始化与之对应的model
//Stage中只显示子模块的根视图，如acticle.main，具体action.main中显示什么由acticle模块自己决定，类似于子路由
const Article = LoadComponent('article', 'main');
const My = LoadComponent('my', 'main');
/*# if:taro #*/
const Shop = LoadComponent('shop', 'main');
/*# end #*/

export interface StoreProps {
  currentModule?: CurrentModule;
  currentView?: CurrentView;
  globalLoading?: LoadingState;
  error?: string;
}

/*# if:react #*/
function mapStateToProps(appState: APPState): StoreProps {
  const {globalLoading, error, currentModule, currentView} = appState.stage!;
  return {
    currentModule,
    currentView,
    globalLoading,
    error,
  };
}
/*# else:vue #*/
function mapStateToProps(appState: APPState): ComputedStore<StoreProps> {
  const stage = appState.stage!;
  return {
    currentModule: () => stage.currentModule,
    currentView: () => stage.currentView,
    globalLoading: () => stage.globalLoading,
    error: () => stage.error,
  };
}
/*# end #*/

/*# if:react #*/
const Component: FC<StoreProps> = ({currentModule, currentView, globalLoading, error}) => {
  return (
    <>
      <DocumentHead title="Elux" />
      <Switch elseView={<ErrorPage />}>
        {!!error && <ErrorPage message={error} />}
        {currentModule === 'stage' && currentView === 'login' && <LoginForm />}
        {currentModule === 'article' && <Article />}
        {currentModule === 'my' && <My />}
        /*# if:taro #*/
        {currentModule === 'shop' && <Shop />}
        /*# end #*/
      </Switch>
      <LoadingPanel loadingState={globalLoading} />
    </>
  );
};

//connectRedux中包含了exportView()的执行
export default connectRedux(mapStateToProps)(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'StageMain',
  setup() {
    const store = useStore();
    const computedStore = mapStateToProps(store.getState());
    const currentModule = computed(computedStore.currentModule);
    const currentView = computed(computedStore.currentView);
    const globalLoading = computed(computedStore.globalLoading);
    const error = computed(computedStore.error);

    return () => (
      <>
        <DocumentHead title="Elux" />
        <Switch elseView={<ErrorPage />}>
          {!!error.value && <ErrorPage message={error.value} />}
          {currentModule.value === 'stage' && currentView.value === 'login' && <LoginForm />}
          {currentModule.value === 'article' && <Article />}
          {currentModule.value === 'my' && <My />}
          /*# if:taro #*/
          {currentModule.value === 'shop' && <Shop />}
          /*# end #*/
        </Switch>
        <LoadingPanel loadingState={globalLoading.value} />
      </>
    );
  },
});

export default exportView(Component);
/*# end #*/
