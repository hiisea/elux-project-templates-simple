/*# if:react #*/
import {FC, useCallback, useState, useMemo, memo} from 'react';
/*# else:vue #*/
import {PropType, defineComponent, ref, watch} from 'vue';
/*# end #*/
import {DocumentHead, Dispatch, exportView} from '<%= elux %>';
import {Modules, useRouter} from '@/Global';
import NavBar from '@/components/NavBar';
import {ItemDetail} from '../../entity';
import styles from './index.module.less';

/*# if:react #*/
interface Props {
  itemDetail/*# =pre??: #*/: ItemDetail;
  dispatch: Dispatch;
}
/*# else:vue #*/
const props = {
  itemDetail: {
    type: Object as PropType<ItemDetail>,
    /*# if:post #*/
    required: true as const,
    /*# end #*/
  },
  dispatch: {
    type: Function as PropType<Dispatch>,
    required: true as const,
  },
};
/*# end #*/

/*# if:react #*/
const Component: FC<Props> = ({itemDetail, dispatch}) => {
  const router = useRouter();
  const onCancel = useCallback(() => router.back(1, 'window'), [router]);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');

  useMemo(() => {
    setTitle(/*# =pre?itemDetail?.title || '':itemDetail.title #*/);
    setSummary(/*# =pre?itemDetail?.summary || '':itemDetail.summary #*/);
    setContent(/*# =pre?itemDetail?.content || '':itemDetail.content #*/);
  }, [itemDetail]);

  const onSubmit = () => {
    if (!title || !summary || !content) {
      setErrorMessage('请输入文章标题、摘要、内容');
    } else {
      const item = {id: itemDetail!.id, title, summary, content};
      if (item.id) {
        dispatch(Modules.article.actions.updateItem(item));
      } else {
        dispatch(Modules.article.actions.createItem(item));
      }
    }
  };

  return (
    <>
      <DocumentHead title="编辑文章" />
      <NavBar title={<%= route==="pre"?"!itemDetail ? '......' : ":"" %>itemDetail.id ? '修改文章' : '新建文章'} />
      <div className={`${styles.root} g-page-content`}>
        <div className="form-body">
          <div className="form-item">
            <div className="label">标题</div>
            <div className="item">
              <input
                name="title"
                className="g-input"
                type="text"
                placeholder="请输入"
                onChange={(e) => setTitle(e.target.value.trim())}
                value={title}
              />
            </div>
          </div>
          <div className="form-item">
            <div className="label">摘要</div>
            <div className="item">
              <textarea
                name="summary"
                className="g-input"
                placeholder="请输入"
                /*# if:taro #*/
                // eslint-disable-next-line react/no-unknown-property
                maxlength={100}
                /*# end #*/
                rows={2}
                onChange={(e) => setSummary(e.target.value.trim())}
                value={summary}
              />
            </div>
          </div>
          <div className="form-item">
            <div className="label">内容</div>
            <div className="item">
              <textarea
                name="content"
                className="g-input"
                placeholder="请输入"
                /*# if:taro #*/
                // eslint-disable-next-line react/no-unknown-property
                maxlength={500}
                /*# end #*/
                rows={10}
                onChange={(e) => setContent(e.target.value.trim())}
                value={content}
              />
            </div>
          </div>
        </div>
        {errorMessage && <div className="form-error">{`* ${errorMessage}`}</div>}
        <div className="form-control">
          <button type="submit" className="g-button primary" onClick={onSubmit}>
            提 交
          </button>
          <button type="button" className="g-button" onClick={onCancel}>
            取 消
          </button>
        </div>
      </div>
    </>
  );
};

export default exportView(memo(Component));
/*# else:vue #*/
const Component = defineComponent({
  name: 'ArticleEdit',
  props,
  setup(props) {
    const router = useRouter();
    const title = ref('');
    const summary = ref('');
    const content = ref('');
    const errorMessage = ref('');
    watch(
      () => props.itemDetail,
      (itemDetail) => {
        title.value = /*# =pre?itemDetail?.title || '':itemDetail.title #*/;
        summary.value = /*# =pre?itemDetail?.summary || '':itemDetail.summary #*/;
        content.value = /*# =pre?itemDetail?.content || '':itemDetail.content #*/;
      },
      {immediate: true}
    );
    const onCancel = () => router.back(1, 'window');
    const onSubmit = () => {
      if (!title.value || !summary.value || !content.value) {
        errorMessage.value = '请输入文章标题、摘要、内容';
      } else {
        const item = {id: props.itemDetail!.id, title: title.value, summary: summary.value, content: content.value};
        if (item.id) {
          props.dispatch(Modules.article.actions.updateItem(item));
        } else {
          props.dispatch(Modules.article.actions.createItem(item));
        }
      }
    };
    return () => (
      <>
        <DocumentHead title="编辑文章" />
        <NavBar title={<%= route==="pre"?"!props.itemDetail ? '......' : ":"" %>props.itemDetail.id ? '修改文章' : '新建文章'} />
        <div class={`${styles.root} g-page-content`}>
          <div class="form-body">
            <div class="form-item">
              <div class="label">标题</div>
              <div class="item">
                <input name="title" class="g-input" type="text" placeholder="请输入" v-model={title.value} />
              </div>
            </div>
            <div class="form-item">
              <div class="label">摘要</div>
              <div class="item">
                <textarea name="summary" class="g-input" placeholder="请输入" maxlength={100} rows={2} v-model={summary.value} />
              </div>
            </div>
            <div class="form-item">
              <div class="label">内容</div>
              <div class="item">
                <textarea name="content" class="g-input" placeholder="请输入" maxlength={500} rows={10} v-model={content.value} />
              </div>
            </div>
          </div>
          {errorMessage.value && <div class="form-error">{`* ${errorMessage.value}`}</div>}
          <div class="form-control">
            <button type="submit" class="g-button primary" onClick={onSubmit}>
              提 交
            </button>
            <button type="button" class="g-button" onClick={onCancel}>
              取 消
            </button>
          </div>
        </div>
      </>
    );
  },
});

export default exportView(Component);
/*# end #*/
