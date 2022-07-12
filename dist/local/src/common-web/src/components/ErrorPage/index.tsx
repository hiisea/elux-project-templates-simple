import {useRouter} from '@/Global';
/*# if:react #*/
import {FC, memo, useCallback} from 'react';
/*# else:vue #*/
import {defineComponent} from 'vue';
/*# end #*/
import styles from './index.module.less';

/*# if:react #*/
export interface Props {
  message?: string;
}
/*# else:vue #*/
const props = {
  message: {
    type: String,
    default: '(404) Not Found!',
  },
};
/*# end #*/

/*# if:react #*/
const Component: FC<Props> = ({message = '(404) Not Found!'}) => {
  const router = useRouter();
  const onBack = useCallback(() => router.back(1, 'page'), [router]);
  return (
    <div className={styles.root}>
      <div className="message">{message}</div>
      <div className="back" onClick={onBack}>
        返回
      </div>
    </div>
  );
};

export default memo(Component);
/*# else:vue #*/
export default defineComponent({
  name: 'ErrorPage',
  props,
  setup(props) {
    const router = useRouter();
    const onBack = () => router.back(1, 'page');
    return () => {
      return (
        <div class={styles.root}>
          <div class="message">{props.message}</div>
          <div class="back" onClick={onBack}>
            返回
          </div>
        </div>
      );
    };
  },
});
/*# end #*/
