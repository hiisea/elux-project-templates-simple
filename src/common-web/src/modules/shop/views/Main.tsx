
/*# if:react #*/
import {Switch, connectStore} from '<%= elux %>';
import {FC} from 'react';
import {APPState} from '@/Global';
import {CurView} from '../entity';
/*# else #*/
import {Switch, exportView} from '<%= elux %>';
import {computed, defineComponent} from 'vue';
import {useStore} from '@/Global';
/*# end #*/
import ErrorPage from '@/components/ErrorPage';
import List from './List';

/*# if:react #*/
export interface StoreProps {
  curView?: CurView;
}

function mapStateToProps(appState: APPState): StoreProps {
  return {curView: appState.shop!.curView};
}

/*# end #*/
/*# if:react #*/
const Component: FC<StoreProps> = ({curView}) => {
  return <Switch elseView={<ErrorPage />}>{curView === 'list' && <List />}</Switch>;
};

export default connectStore(mapStateToProps)(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'ShopMain',
  setup() {
    const store = useStore();
    const curView = computed(() => store.state.shop!.curView);
    
    return () => {
      return <Switch elseView={<ErrorPage />}>{curView.value === 'list' && <List />}</Switch>;
    };
  },
});

export default exportView(Component);
/*# end #*/