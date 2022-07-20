/*# if:react #*/
import {FC, memo, useCallback, useState, useMemo} from 'react';
/*# else:vue #*/
import {defineComponent, PropType, ref, watch} from 'vue';
/*# end #*/
import styles from './index.module.less';

/*# if:react #*/
interface Props {
  keyword: string;
  onSubmit: (keyword: string) => void;
  onCreate: () => void;
}
/*# else:vue #*/
const props = {
  keyword: {
    type: String,
    required: true as const,
  },
  onSubmit: {
    type: Function as PropType<(keyword: string) => void>,
    required: true as const,
  },
  onCreate: {
    type: Function as PropType<() => void>,
    required: true as const,
  },
};
/*# end #*/

/*# if:react #*/
const Component: FC<Props> = (props) => {
  const {onSubmit, onCreate} = props;
  const [keyword, setKeyword] = useState(props.keyword);
  useMemo(() => {
    setKeyword(props.keyword);
  }, [props.keyword]);
  const onSubmitHandler = useCallback(() => {
    onSubmit(keyword);
  }, [keyword, onSubmit]);
  const onCreateHandler = useCallback(() => {
    onCreate();
  }, [onCreate]);

  return (
    <div className={styles.root}>
      <input
        className="keyword"
        name="keyword"
        type="text"
        placeholder="请输入搜索关键字..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value.trim())}
      />
      <button className="search" onClick={onSubmitHandler}>
        搜索
      </button>
      <div className="add" onClick={onCreateHandler}>
        +新增
      </div>
    </div>
  );
};

export default memo(Component);
/*# else:vue #*/
export default defineComponent({
  name: 'ArticleSearchBar',
  props,
  emits: ['submit', 'create'],
  setup(props, {emit}) {
    const keywordInput = ref(props.keyword);
    watch(
      () => props.keyword,
      (value) => {
        keywordInput.value = value;
      }
    );
    const onSubmitHandler = () => {
      emit('submit', keywordInput.value);
    };
    const onCreateHandler = () => {
      emit('create');
    };
    return () => (
      <div class={styles.root}>
        <input class="keyword" name="keyword" type="text" placeholder="请输入搜索关键字..." v-model={keywordInput.value} />
        <button class="search" onClick={onSubmitHandler}>
          搜索
        </button>
        <div class="add" onClick={onCreateHandler}>
          +新增
        </div>
      </div>
    );
  },
});
/*# end #*/
