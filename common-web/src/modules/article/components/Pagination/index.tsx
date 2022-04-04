/*# if:react #*/
import {FC, memo} from 'react';
/*# else:vue #*/
import {PropType, defineComponent} from 'vue';
/*# end #*/
import {Link} from '<%= elux %>';
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
  return (
    <div className={styles.root}>
      {pageCurrent > 1 && (
        <Link className="item" onClick={() => onChange(pageCurrent - 1)}>
          上一页
        </Link>
      )}
      {pageCurrent < totalPages && (
        <Link className="item" onClick={() => onChange(pageCurrent + 1)}>
          下一页
        </Link>
      )}
      <div className="info">{`- 第 ${pageCurrent} 页 / 共 ${totalPages} 页 -`}</div>
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
    props.pageCurrent;
    const onChangeHandler = (currentPage: number) => {
      emit('change', currentPage);
    };
    return () => (
      <div class={styles.root}>
        {props.pageCurrent > 1 && (
          <Link class="item" onClick={() => onChangeHandler(props.pageCurrent - 1)}>
            上一页
          </Link>
        )}
        {props.pageCurrent < props.totalPages && (
          <Link class="item" onClick={() => onChangeHandler(props.pageCurrent + 1)}>
            下一页
          </Link>
        )}
        <div class="info">{`- 第 ${props.pageCurrent} 页 / 共 ${props.totalPages} 页 -`}</div>
      </div>
    );
  },
});
/*# end #*/
