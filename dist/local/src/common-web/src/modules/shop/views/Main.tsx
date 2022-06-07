import ErrorPage from '@/components/ErrorPage';
import {APPState/*# =vue?, useStore: #*/} from '@/Global';
/*# if:react #*/
import {connectRedux, Switch} from '<%= elux %>';
/*# else:vue #*/
import {ComputedStore, exportView, Switch} from '<%= elux %>';
/*# end #*/
/*# if:react #*/
import {FC} from 'react';
/*# else:vue #*/
import {computed, defineComponent} from 'vue';
/*# end #*/
import {CurView} from '../entity';
import List from './List';

export interface StoreProps {
  curView?: CurView;
}

/*# if:react #*/
function mapStateToProps(appState: APPState): StoreProps {
  return {curView: appState.shop!.curView};
}
/*# else:vue #*/
//这里保持和Redux的风格一致，也可以省去这一步，直接使用computed
function mapStateToProps(appState: APPState): ComputedStore<StoreProps> {
  const shop = appState.shop!;
  return {
    curView: () => shop.curView,
  };
}
/*# end #*/

/*# if:react #*/
const Component: FC<StoreProps> = ({curView}) => {
  return <Switch elseView={<ErrorPage />}>{curView === 'list' && <List />}</Switch>;
};

export default connectRedux(mapStateToProps)(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'ShopMain',
  setup() {
    const store = useStore();
    const computedStore = mapStateToProps(store.getState());
    const curView = computed(computedStore.curView);
    return () => {
      return <Switch elseView={<ErrorPage />}>{curView.value === 'list' && <List />}</Switch>;
    };
  },
});

export default exportView(Component);
/*# end #*/