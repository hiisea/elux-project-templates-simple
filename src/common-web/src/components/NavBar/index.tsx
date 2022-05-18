/*# if:react #*/
import {FC, memo, useCallback} from 'react';
/*# else:vue #*/
import {PropType, defineComponent} from 'vue';
/*# end #*/
import {useRouter} from '@/Global';
import styles from './index.module.less';

/*# if:react #*/
interface Props {
  title: string;
  onBack?: Boolean | (() => void);
}
/*# else:vue #*/
const props = {
  title: {
    type: String,
    required: true as const,
  },
  onBack: {
    type: [Function, Boolean] as PropType<Boolean | (() => void)>,
  },
};
/*# end #*/

/*# if:react #*/
const Component: FC<Props> = ({title, onBack}) => {
  const router = useRouter();
  const onClick = useCallback(() => {
    if (typeof onBack === 'function') {
      onBack();
    } else if (onBack === true) {
      router.back(1, 'window');
    }
  }, [onBack, router]);

  return (
    <div className={styles.root}>
      {onBack && <div className="back" onClick={onClick} />}
      <div className="title">{title}</div>
    </div>
  );
};

export default memo(Component);
/*# else:vue #*/
export default defineComponent({
  name: 'NavBar',
  props,
  setup(props) {
    const router = useRouter();
    const onClick = () => {
      if (typeof props.onBack === 'function') {
        props.onBack();
      } else if (props.onBack === true) {
        router.back(1, 'window');
      }
    };
    return () => (
      <div class={styles.root}>
        {props.onBack && <div class="back" onClick={onClick} />}
        <div class="title">{props.title}</div>
      </div>
    );
  },
});
/*# end #*/
