import {Link} from '<%= elux %>';
/*# if:react #*/
import {FC, memo} from 'react';
/*# else:vue #*/
import {computed, defineComponent} from 'vue';
/*# end #*/
import styles from './index.module.less';

/*# if:react #*/
interface Props {
  totalPages: number;
  pageCurrent: number;
  baseUrl: string;
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
  baseUrl: {
    type: String,
    required: true as const,
  },
};
/*# end #*/

function replacePageNumber(baseUrl: string, pageCurrent: number): string {
  return baseUrl.replace('pageCurrent=0', `pageCurrent=${pageCurrent}`);
}

/*# if:react #*/
const Component: FC<Props> = ({totalPages, pageCurrent, baseUrl}) => {
  return (
    <div className={styles.root}>
      {pageCurrent > 1 && (
        <Link className="item" action="push" target="page" to={replacePageNumber(baseUrl, pageCurrent - 1)}>
          上一页
        </Link>
      )}
      {pageCurrent < totalPages && (
        <Link className="item" action="push" target="page" to={replacePageNumber(baseUrl, pageCurrent + 1)}>
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
  setup(props) {
    const prevPage = computed(() => replacePageNumber(props.baseUrl, props.pageCurrent - 1));
    const nextPage = computed(() => replacePageNumber(props.baseUrl, props.pageCurrent + 1));
    return () => (
      <div class={styles.root}>
        {props.pageCurrent > 1 && (
          <Link class="item" action="push" target="page" to={prevPage.value}>
            上一页
          </Link>
        )}
        {props.pageCurrent < props.totalPages && (
          <Link class="item" action="push" target="page" to={nextPage.value}>
            下一页
          </Link>
        )}
        <div class="info">{`- 第 ${props.pageCurrent} 页 / 共 ${props.totalPages} 页 -`}</div>
      </div>
    );
  },
});
/*# end #*/
