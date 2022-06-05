import {DocumentHead, exportView, Link} from '<%= elux %>';
/*# if:react #*/
import {FC, memo} from 'react';
/*# else:vue #*/
import {defineComponent, PropType} from 'vue';
/*# end #*/
import {ItemDetail} from '../../entity';
import styles from './index.module.less';

/*# if:react #*/
interface Props {
  itemDetail/*# =pre??: #*/: ItemDetail;
}
/*# else:vue #*/
const props = {
  itemDetail: {
    type: Object as PropType<ItemDetail>,
    /*# if:post #*/
    required: true as const,
    /*# end #*/
  },
};
/*# end #*/

/*# if:react #*/
const Component: FC<Props> = ({itemDetail}) => {
  return (
    <div className={`${styles.root} g-page-content`}>
      <DocumentHead title={/*# =pre?itemDetail?.title || '......':itemDetail.title #*/} />
      /*# if:admin #*/
      <h2>文章管理</h2>
      /*# end #*/
      <div className="hd">
        <Link className="back" to={1} action="back" target="window"></Link>
        <div className="title">{/*# =pre?itemDetail?.title || '......':itemDetail.title #*/}</div>
        <div className="summary">{/*# =pre?itemDetail?.summary || '......':itemDetail.summary #*/}</div>
      </div>
      <div className="bd">{/*# =pre?itemDetail?.content || '':itemDetail.content #*/}</div>
    </div>
  );
};

export default exportView(memo(Component));
/*# else:vue #*/
const Component = defineComponent({
  name: 'ArticleDetail',
  props,
  setup(props) {
    return () => (
      <div class={`${styles.root} g-page-content`}>
        <DocumentHead title={/*# =pre?props.itemDetail?.title || '......':props.itemDetail.title #*/} />
        /*# if:admin #*/
        <h2>文章管理</h2>
        /*# end #*/
        <div class="hd">
          <Link class="back" to={1} action="back" target="window"></Link>
          <div class="title">{/*# =pre?props.itemDetail?.title || '......':props.itemDetail.title #*/}</div>
          <div class="summary">{/*# =pre?props.itemDetail?.summary || '......':props.itemDetail.summary #*/}</div>
        </div>
        <div class="bd">{/*# =pre?props.itemDetail?.content || '':props.itemDetail.content #*/}</div>
      </div>
    );
  },
});

export default exportView(Component);
/*# end #*/