/*# if:react #*/
import {FC, useMemo, memo} from 'react';
/*# else:vue #*/
import {computed, defineComponent, PropType} from 'vue';
/*# end #*/
import styles from './index.module.less';

/*# if:react #*/
interface Props {
  totalPages: number;
  pageCurrent: number;
  onChange: (page: number) => void;
}
/*# else:vue #*/
const props = {
  totalPages: {
    type: Number,
    required: true as const,
  },
  pageCurrent: {
    type: Number,
    required: true as const,
  },
  onChange: {
    type: Function as PropType<(page: number) => void>,
    required: true as const,
  },
};
/*# end #*/

/*# if:react #*/
const Component: FC<Props> = ({totalPages, pageCurrent, onChange}) => {
  const pages = useMemo(() => {
    const min = Math.max(1, pageCurrent - 3);
    const max = Math.min(totalPages, pageCurrent + 3);
    const arr: number[] = [];
    for (let i = min; i <= max; i++) {
      arr.push(i);
    }
    return arr;
  }, [pageCurrent, totalPages]);
  return (
    <div className={styles.root}>
      <div className="info">{`第 ${pageCurrent} 页 / 共 ${totalPages} 页`}</div>
      <div className="pages">
        {pageCurrent > 1 && <a onClick={() => onChange(pageCurrent - 1)}>&#60;</a>}
        {pages[0] > 1 && <span>...</span>}
        {pages.map((val) => (
          <a key={val} onClick={() => onChange(val)} className={val === pageCurrent ? 'on' : ''}>
            {val}
          </a>
        ))}
        {pages[pages.length - 1] < totalPages && <span>...</span>}
        {pageCurrent < totalPages && <a onClick={() => onChange(pageCurrent + 1)}>&#62;</a>}
      </div>
    </div>
  );
};

export default memo(Component);
/*# else:vue #*/
export default defineComponent({
  name: 'ArticlePagination',
  props,
  emits: ['change'],
  setup(props, {emit}) {
    const _pages = computed(() => {
      const min = Math.max(1, props.pageCurrent - 3);
      const max = Math.min(props.totalPages, props.pageCurrent + 3);
      const arr: number[] = [];
      for (let i = min; i <= max; i++) {
        arr.push(i);
      }
      return arr;
    });

    return () => {
      const pages = _pages.value;
      const {pageCurrent, totalPages} = props;
      return (
        <div class={styles.root}>
          <div class="info">{`第 ${pageCurrent} 页 / 共 ${totalPages} 页`}</div>
          <div class="pages">
            {pageCurrent > 1 && <a onClick={() => emit('change', pageCurrent - 1)}>&#60;</a>}
            {pages[0] > 1 && <span>...</span>}
            {pages.map((val) => (
              <a key={val} onClick={() => emit('change', val)} class={val === pageCurrent ? 'on' : ''}>
                {val}
              </a>
            ))}
            {pages[pages.length - 1] < totalPages && <span>...</span>}
            {pageCurrent < totalPages && <a onClick={() => emit('change', pageCurrent + 1)}>&#62;</a>}
          </div>
        </div>
      );
    };
  },
});
/*# end #*/
