/*# if:react #*/
import {FC, useCallback, memo} from 'react';
/*# else:vue #*/
import {PropType, defineComponent} from 'vue';
/*# end #*/
import {DocumentHead, exportView} from '<%= elux %>';
import {useRouter} from '@/Global';
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
  const router = useRouter();
  const onBack = useCallback(() => router.back(1, 'window'), [router]);

  return (
    <>
      <DocumentHead title={/*# =pre?itemDetail?.title || '......':itemDetail.title #*/} />
      <div className={`${styles.root} g-page-content`}>
        <div className="hd">
          <div className="back" onClick={onBack}></div>
          <div className="title">{/*# =pre?itemDetail?.title || '......':itemDetail.title #*/}</div>
          <div className="summary">{/*# =pre?itemDetail?.summary || '......':itemDetail.summary #*/}</div>
        </div>
        <div className="bd">{/*# =pre?itemDetail?.content || '......':itemDetail.content #*/}</div>
      </div>
    </>
  );
};

export default exportView(memo(Component));
/*# else:vue #*/
const Component = defineComponent({
  name: 'ArticleDetail',
  props,
  setup(props) {
    const router = useRouter();
    const onBack = () => router.back(1, 'window');
    return () => (
      <>
        <DocumentHead title={/*# =pre?props.itemDetail?.title || '......':props.itemDetail.title #*/} />
        <div class={`${styles.root} g-page-content`}>
          <div class="hd">
            <div class="back" onClick={onBack}></div>
            <div class="title">{/*# =pre?props.itemDetail?.title || '......':props.itemDetail.title #*/}</div>
            <div class="summary">{/*# =pre?props.itemDetail?.summary || '......':props.itemDetail.summary #*/}</div>
          </div>
          <div class="bd">{/*# =pre?props.itemDetail?.content || '......':props.itemDetail.content #*/}</div>
        </div>
      </>
    );
  },
});

export default exportView(Component);
/*# end #*/