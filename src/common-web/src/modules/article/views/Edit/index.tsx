/*# if:!admin #*/
import NavBar from '@/components/NavBar';
/*# else #*/
import DialogPage from '@/components/DialogPage';
/*# end #*/
import {Modules} from '@/Global';
import {Dispatch, /*# =!admin?DocumentHead, : #*/exportView, Link} from '<%= elux %>';
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
    /*# if:!admin #*/
    <>
      <NavBar title="编辑文章" />
      <div className={`${styles.root} g-page-content`}>
        <DocumentHead title="编辑文章" />
    /*# else #*/
    <DialogPage title="编辑文章" subject="编辑文章" mask>
      <div className={`${styles.root} g-dialog-content`}>
    /*# end #*/
        <div className="g-form">
          <div className="item">
            <div className="item">标题</div>
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
          <div className="item">
            <div className="item">摘要</div>
            <div className="item">
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
          <div className="item item-last">
            <div className="item">内容</div>
            <div className="item">
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
          <div className="item item-error">
            <div className="item"></div>
            <div className="item">{errorMessage}</div>
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
    /*# if:!admin #*/
    </>
    /*# else #*/
    </DialogPage>
    /*# end #*/
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
      /*# if:!admin #*/
      <>
        <NavBar title="编辑文章" />
        <div class={`${styles.root} g-page-content`}>
          <DocumentHead title="编辑文章" />
      /*# else #*/
      <DialogPage title="编辑文章" subject="编辑文章" mask>
        <div class={`${styles.root} g-dialog-content`}>
      /*# end #*/
          <div class="g-form">
            <div class="item">
              <div class="item">标题</div>
              <div class="item">
                <input name="title" class="g-input" type="text" placeholder="请输入" v-model={title.value} />
              </div>
            </div>
            <div class="item">
              <div class="item">摘要</div>
              <div class="item">
                <textarea name="summary" class="g-input" placeholder="请输入" /*# =taro?maxlength={100} : #*/rows={2} v-model={summary.value} />
              </div>
            </div>
            <div class="item item-last">
              <div class="item">内容</div>
              <div class="item">
                <textarea name="content" class="g-input" placeholder="请输入" /*# =taro?maxlength={500} : #*/rows={10} v-model={content.value} />
              </div>
            </div>
            <div class="item item-error">
              <div class="item"></div>
              <div class="item">{errorMessage.value}</div>
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
      /*# if:!admin #*/
      </>
      /*# else #*/
      </DialogPage>
      /*# end #*/
    );
  },
});

export default exportView(Component);
/*# end #*/
