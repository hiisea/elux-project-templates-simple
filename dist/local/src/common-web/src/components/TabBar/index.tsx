import {Link} from '<%= elux %>';
/*# if:react #*/
import {FC, memo} from 'react';
/*# else:vue #*/
import {PropType, defineComponent} from 'vue';
/*# end #*/
import styles from './index.module.less';

/*# if:react #*/
interface Props {
  selected: 'article' | 'my';
}
/*# else:vue #*/
const props = {
  selected: {
    type: String as PropType<'article' | 'my'>,
    required: true as const,
  },
};
/*# end #*/

/*# if:react #*/
const Component: FC<Props> = ({selected}) => {
  return (
    <div className={styles.root}>
      <Link to="/article/list" action="relaunch" target="window" className={`item ${selected === 'article' ? 'on' : ''}`}>
        文章
      </Link>
      <Link to="/admin/my/userSummary" action="relaunch" target="window" className={`item ${selected === 'my' ? 'on' : ''}`}>
        我的
      </Link>
    </div>
  );
};

export default memo(Component);
/*# else:vue #*/
export default defineComponent({
  name: 'TabBar',
  props,
  setup(props) {
    return () => (
      <div class={styles.root}>
        <Link to="/article/list" action="relaunch" target="window" class={{item: true, on: props.selected === 'article'}}>
          文章
        </Link>
        <Link to="/admin/my/userSummary" action="relaunch" target="window" class={{item: true, on: props.selected === 'my'}}>
          我的
        </Link>
      </div>
    );
  },
});
/*# end #*/
