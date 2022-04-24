/*# if:react #*/
import {FC} from 'react';
/*# else:vue #*/
import {defineComponent, computed} from 'vue';
/*# end #*/
import {Switch, /*# =react?connectRedux:ComputedStore, exportView #*/} from '<%= elux %>';
import {APPState/*# =vue?, useStore: #*/} from '@/Global';
import ErrorPage from '@/components/ErrorPage';
import GoodsList from './GoodsList';
import {CurrentView} from '../entity';

export interface StoreProps {
  currentView?: CurrentView;
}

/*# if:react #*/
function mapStateToProps(appState: APPState): StoreProps {
  return {currentView: appState.shop!.currentView};
}
/*# else:vue #*/
function mapStateToProps(appState: APPState): ComputedStore<StoreProps> {
  const shop = appState.shop!;
  return {
    currentView: () => shop.currentView,
  };
}
/*# end #*/

/*# if:react #*/
const Component: FC<StoreProps> = ({currentView}) => {
  return <Switch elseView={<ErrorPage />}>{currentView === 'goodsList' && <GoodsList />}</Switch>;
};

export default connectRedux(mapStateToProps)(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'ShopMain',
  setup() {
    const store = useStore();
    const computedStore = mapStateToProps(store.getState());
    const currentView = computed(computedStore.currentView);
    return () => {
      return <Switch elseView={<ErrorPage />}>{currentView.value === 'goodsList' && <GoodsList />}</Switch>;
    };
  },
});

export default exportView(Component);
/*# end #*/