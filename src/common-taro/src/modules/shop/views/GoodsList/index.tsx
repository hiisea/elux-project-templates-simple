/*# if:react #*/
import {FC, memo} from 'react';
/*# else:vue #*/
import {defineComponent} from 'vue';
/*# end #*/
import {DocumentHead, exportView} from '<%= elux %>';
import NavBar from '@/components/NavBar';
import styles from './index.module.less';

/*# if:react #*/
const Component: FC = () => {
  return (
    <>
      <DocumentHead title="商品列表" />
      <NavBar title="商品列表" onBack />
      <div className={`${styles.root} g-page-content`}>
        <div className="item">---商品1---</div>
        <div className="item">---商品2---</div>
        <div className="item">---商品3---</div>
      </div>
    </>
  );
};

export default exportView(memo(Component));
/*# else:vue #*/
const Component = defineComponent({
  name: 'ShopGoodsList',
  setup() {
    return () => {
      return (
        <>
          <DocumentHead title="商品列表" />
          <NavBar title="商品列表" onBack />
          <div class={`${styles.root} g-page-content`}>
            <div class="item">---商品1---</div>
            <div class="item">---商品2---</div>
            <div class="item">---商品3---</div>
          </div>
        </>
      );
    };
  },
});
export default exportView(Component);
/*# end #*/
