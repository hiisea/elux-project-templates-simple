/*# if:react #*/
import {FC, memo} from 'react';
/*# else:vue #*/
import {defineComponent} from 'vue';
/*# end #*/
import styles from './index.module.less';

/*# if:react #*/
const Component: FC = () => {
  return (
    <div className={styles.root}>
      <div className="title">没有权限</div>
    </div>
  );
};

export default memo(Component);
/*# else:vue #*/
export default defineComponent({
  name: 'AdminForbidden',
  setup() {
    return () => (
      <div class={styles.root}>
        <div class="title">没有权限</div>
      </div>
    );
  },
});
/*# end #*/
