import NavBar from '@/components/NavBar';
import {DocumentHead, exportView} from '<%= elux %>';
/*# if:react #*/
import {FC, memo} from 'react';
/*# else:vue #*/
import {defineComponent} from 'vue';
/*# end #*/
import styles from './index.module.less';

/*# if:react #*/
const Component: FC = () => {
  return (
    <>
      <NavBar title="商品列表" onBack />
      <div className={`${styles.root} g-page-content`}>
        <DocumentHead title="商品列表" />
        <div className="note">本页面主要用来演示小程序下的“分包加载”</div>
        <div className="list">
          <div>---商品1---</div>
          <div>---商品2---</div>
          <div>---商品3---</div>
        </div>
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
          <NavBar title="商品列表" onBack />
          <div class={`${styles.root} g-page-content`}>
            <DocumentHead title="商品列表" />
            <div class="note">本页面主要用来演示小程序下的“分包加载”</div>
            <div class="list">
              <div>---商品1---</div>
              <div>---商品2---</div>
              <div>---商品3---</div>
            </div>
          </div>
        </>
      );
    };
  },
});
export default exportView(Component);
/*# end #*/
