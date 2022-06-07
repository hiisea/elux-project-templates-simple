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
      <div className="title">
        /*# if:admin #*/
        Elux后台管理系统<span className="ver">v1.2</span>
        /*# else #*/
        没有权限
        /*# end #*/
      </div>
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
        <div class="title">
        /*# if:admin #*/
        Elux后台管理系统<span class="ver">v1.2</span>
        /*# else #*/
        没有权限
        /*# end #*/
        </div>
      </div>
    );
  },
});
/*# end #*/
