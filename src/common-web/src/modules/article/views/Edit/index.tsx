import NavBar from '@/components/NavBar';
import {Modules} from '@/Global';
import {Dispatch, DocumentHead, exportView, Link} from '<%= elux %>';
/*# if:react #*/
import {FC, memo, useMemo, useState} from 'react';
/*# else:vue #*/
import {defineComponent, PropType, ref, watch} from 'vue';
/*# end #*/
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
      <NavBar title={<%= route==="pre"?"!itemDetail ? '......' : ":"" %>itemDetail.id ? '修改文章' : '新建文章'} />
      <div className={`${styles.root} g-page-content`}>
        <DocumentHead title="编辑文章" />
        <div className="g-form">
          <div>
            <div>标题</div>
            <div>
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
          <div>
            <div>摘要</div>
            <div>
              <textarea
                name="summary"
                className="g-input"
                placeholder="请输入"
                /*# if:taro #*/
                // eslint-disable-next-line
                maxlength={100}
                /*# end #*/
                rows={2}
                onInput={(e) => setSummary(e.target['value'].trim())}
                value={summary}
              />
            </div>
          </div>
          <div className="item-last">
            <div>内容</div>
            <div>
              <textarea
                name="content"
                className="g-input"
                placeholder="请输入"
                /*# if:taro #*/
                // eslint-disable-next-line
                maxlength={500}
                /*# end #*/
                rows={10}
                onInput={(e) => setContent(e.target['value'].trim())}
                value={content}
              />
            </div>
          </div>
          <div className="item-error">
            <div></div>
            <div>{errorMessage}</div>
          </div>
        </div>
        <div className="g-control">
          <button type="submit" className="g-button primary" onClick={onSubmit}>
            提 交
          </button>
          <Link className="g-button" to={1} action="back" target="window">
            取 消
          </Link>
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
        <NavBar title={<%= route==="pre"?"!props.itemDetail ? '......' : ":"" %>props.itemDetail.id ? '修改文章' : '新建文章'} />
        <div class={`${styles.root} g-page-content`}>
          <DocumentHead title="编辑文章" />
          <div class="g-form">
            <div>
              <div>标题</div>
              <div>
                <input name="title" class="g-input" type="text" placeholder="请输入" v-model={title.value} />
              </div>
            </div>
            <div>
              <div>摘要</div>
              <div>
                <textarea name="summary" class="g-input" placeholder="请输入" /*# =taro?maxlength={100} : #*/rows={2} v-model={summary.value} />
              </div>
            </div>
            <div class="item-last">
              <div>内容</div>
              <div>
                <textarea name="content" class="g-input" placeholder="请输入" /*# =taro?maxlength={500} : #*/rows={10} v-model={content.value} />
              </div>
            </div>
            <div class="item-error">
              <div></div>
              <div>{errorMessage.value}</div>
            </div>
          </div>
          <div class="g-control">
            <button type="submit" class="g-button primary" onClick={onSubmit}>
              提 交
            </button>
            <Link class="g-button" to={1} action="back" target="window">
              取 消
            </Link>
          </div>
        </div>
      </>
    );
  },
});

export default exportView(Component);
/*# end #*/
