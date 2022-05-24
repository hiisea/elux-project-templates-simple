import {LoadingState} from '<%= elux %>';
/*# if:react #*/
import {FC, memo} from 'react';
/*# else:vue #*/
import {defineComponent, PropType} from 'vue';
/*# end #*/
import styles from './index.module.less';

/*# if:react #*/
interface Props {
  loadingState?: LoadingState;
}
/*# else:vue #*/
const props = {
  loadingState: {
    type: String as PropType<LoadingState>,
  },
};
/*# end #*/

/*# if:react #*/
const Component: FC<Props> = ({loadingState}) => {
  return (
    <div className={`${styles.root} ${loadingState?.toLowerCase()}`}>
      <div className="loading-icon" />
    </div>
  );
};

export default memo(Component);
/*# else:vue #*/
export default defineComponent({
  name: 'LoadingPanel',
  props,
  setup(props) {
    return () => (
      <div class={`${styles.root} ${props.loadingState?.toLowerCase()}`}>
        <div class="loading-icon" />
      </div>
    );
  },
});
/*# end #*/
