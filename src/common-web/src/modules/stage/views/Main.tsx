import '@/assets/css/global.module.less';
/*# if:react #*/
import {DocumentHead, LoadingState, Switch, connectRedux} from '<%= elux %>';
import {FC} from 'react';
import {APPState, LoadComponent} from '@/Global';
import {CurView, SubModule} from '../entity';
/*# else #*/
import {DocumentHead, Switch, exportView} from '<%= elux %>';
import {computed, defineComponent} from 'vue';;
import {LoadComponent, useStore} from '@/Global';
import {SubModule} from '../entity';
/*# end #*/
import ErrorPage from '@/components/ErrorPage';
import LoadingPanel from '@/components/LoadingPanel';
import LoginForm from './LoginForm';

//LoadComponent是懒执行的，不用担心
const SubModuleViews: {[moduleName: string]: () => JSX.Element} = Object.keys(SubModule).reduce((cache, moduleName) => {
  cache[moduleName] = LoadComponent(moduleName as any, 'main');
  return cache;
}, {});

/*# if:react #*/
export interface StoreProps {
  subModule?: SubModule;
  curView?: CurView;
  globalLoading?: LoadingState;
  error?: string;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {subModule, curView, globalLoading, error} = appState.stage!;
  return {
    subModule,
    curView,
    globalLoading,
    error,
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
    const subModule = computed(() => store.state.stage!.subModule);
    const curView = computed(() => store.state.stage!.curView);
    const globalLoading = computed(() => store.state.stage!.globalLoading);
    const error = computed(() => store.state.stage!.error);

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
