
/*# if:react #*/
import {FC} from 'react';
/*# else #*/
import {defineComponent} from 'vue';
/*# end #*/
import {/*# =vue?exportView,: #*/ Switch, connectStore} from '<%= elux %>';
import {APPState} from '@/Global';
import ErrorPage from '@/components/ErrorPage';
import {CurView} from '../entity';
import List from './List';

export interface StoreProps {
  curView?: CurView;
}

function mapStateToProps(appState: APPState): StoreProps {
  return {curView: appState.shop!.curView};
}

/*# if:react #*/
const Component: FC<StoreProps> = ({curView}) => {
  return <Switch elseView={<ErrorPage />}>{curView === 'list' && <List />}</Switch>;
};

export default connectStore(mapStateToProps)(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'ShopMain',
  setup() {
    const storeProps = connectStore(mapStateToProps);
    
    return () => {
      const {curView} = storeProps;
      return <Switch elseView={<ErrorPage />}>{curView === 'list' && <List />}</Switch>;
    };
  },
});

export default exportView(Component);
/*# end #*/