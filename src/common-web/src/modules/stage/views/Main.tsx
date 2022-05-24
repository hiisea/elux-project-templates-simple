import '@/assets/css/global.module.less';
import ErrorPage from '@/components/ErrorPage';
import LoadingPanel from '@/components/LoadingPanel';
import {APPState, LoadComponent/*# =vue?, useStore: #*/} from '@/Global';
/*# if:react #*/
import {connectRedux, DocumentHead, LoadingState, Switch} from '<%= elux %>';
/*# else:vue #*/
import {ComputedStore, DocumentHead, exportView, LoadingState, Switch} from '<%= elux %>';
/*# end #*/
/*# if:react #*/
import {FC} from 'react';
/*# else:vue #*/
import {computed, defineComponent} from 'vue';
/*# end #*/
import {CurView, SubModule} from '../entity';
import LoginForm from './LoginForm';

//LoadComponent是懒执行的，不用担心
const SubModuleViews: {[moduleName: string]: () => JSX.Element} = Object.keys(SubModule).reduce((cache, moduleName) => {
  cache[moduleName] = LoadComponent(moduleName as any, 'main');
  return cache;
}, {});

export interface StoreProps {
  subModule?: SubModule;
  curView?: CurView;
  globalLoading?: LoadingState;
  error?: string;
}

/*# if:react #*/
function mapStateToProps(appState: APPState): StoreProps {
  const {subModule, curView, globalLoading, error} = appState.stage!;
  return {
    subModule,
    curView,
    globalLoading,
    error,
  };
}
/*# else:vue #*/
//这里保持和Redux的风格一致，也可以省去这一步，直接使用computed
function mapStateToProps(appState: APPState): ComputedStore<StoreProps> {
  const stage = appState.stage!;
  return {
    subModule: () => stage.subModule,
    curView: () => stage.curView,
    globalLoading: () => stage.globalLoading,
    error: () => stage.error,
  };
}
/*# end #*/

/*# if:react #*/
const Component: FC<StoreProps> = ({subModule, curView, globalLoading, error}) => {
  return (
    <>
      <DocumentHead title="EluxDemo" />
      <Switch elseView={<ErrorPage />}>
        {!!error && <ErrorPage message={error} />}
        {subModule &&
          Object.keys(SubModule).map((moduleName) => {
            if (subModule === moduleName) {
              const SubView = SubModuleViews[subModule];
              return <SubView key={moduleName} />;
            } else {
              return null;
            }
          })}
        {curView === 'login' && <LoginForm />}
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
    const subModule = computed(computedStore.subModule);
    const curView = computed(computedStore.curView);
    const globalLoading = computed(computedStore.globalLoading);
    const error = computed(computedStore.error);

    return () => (
      <>
        <DocumentHead title="EluxDemo" />
        <Switch elseView={<ErrorPage />}>
          {!!error.value && <ErrorPage message={error.value} />}
          {subModule.value &&
          Object.keys(SubModule).map((moduleName) => {
            if (subModule.value === moduleName) {
              const SubView = SubModuleViews[subModule.value];
              return <SubView key={moduleName} />;
            } else {
              return null;
            }
          })}
          {curView.value === 'login' && <LoginForm />}
        </Switch>
        <LoadingPanel loadingState={globalLoading.value} />
      </>
    );
  },
});

export default exportView(Component);
/*# end #*/
