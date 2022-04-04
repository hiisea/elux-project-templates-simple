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
import {CurrentView} from '../entity';
import '@/assets/css/global.module.less';

const Article = LoadComponent('article', 'main');
const My = LoadComponent('my', 'main');

export interface StoreProps {
  currentView?: CurrentView;
  globalLoading?: LoadingState;
  error?: string;
}

/*# if:react #*/
function mapStateToProps(appState: APPState): StoreProps {
  const {globalLoading, error, currentView} = appState.stage!;
  return {
    currentView,
    globalLoading,
    error,
  };
}
/*# else:vue #*/
function mapStateToProps(appState: APPState): ComputedStore<StoreProps> {
  const stage = appState.stage!;
  return {
    currentView: () => stage.currentView,
    globalLoading: () => stage.globalLoading,
    error: () => stage.error,
  };
}
/*# end #*/

/*# if:react #*/
const Component: FC<StoreProps> = ({currentView, globalLoading, error}) => {
  return (
    <>
      <DocumentHead title="Elux" />
      <Switch elseView={<ErrorPage />}>
        {!!error && <ErrorPage message={error} />}
        {currentView === 'login' && <LoginForm />}
        {currentView === 'article' && <Article />}
        {currentView === 'my' && <My />}
      </Switch>
      <LoadingPanel loadingState={globalLoading} />
    </>
  );
};

export default connectRedux(mapStateToProps)(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'StageMain',
  setup() {
    const store = useStore();
    const computedStore = mapStateToProps(store.getState());
    const currentView = computed(computedStore.currentView);
    const globalLoading = computed(computedStore.globalLoading);
    const error = computed(computedStore.error);

    return () => (
      <>
        <DocumentHead title="Elux" />
        <Switch elseView={<ErrorPage />}>
          {!!error.value && <ErrorPage message={error.value} />}
          {currentView.value === 'login' && <LoginForm />}
          {currentView.value === 'article' && <Article />}
          {currentView.value === 'my' && <My />}
        </Switch>
        <LoadingPanel loadingState={globalLoading.value} />
      </>
    );
  },
});

export default exportView(Component);
/*# end #*/
