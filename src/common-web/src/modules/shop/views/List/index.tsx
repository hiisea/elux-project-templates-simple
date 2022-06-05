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
    /*# =admin?<div className={styles.root}>:<> #*/
      <NavBar title="商品列表" onBack />
      <div className=/*# =admin?"g-page-content":{styles.root + ' g-page-content'} #*/>
        <DocumentHead title="商品列表" />
        <div className="note">本页面主要用来演示小程序下的“分包加载”</div>
        <div className="list">
          <div className="item">---商品1---</div>
          <div className="item">---商品2---</div>
          <div className="item">---商品3---</div>
        </div>
      </div>
    /*# =admin?</div>:</> #*/
  );
};

export default exportView(memo(Component));
/*# else:vue #*/
const Component = defineComponent({
  name: 'ShopGoodsList',
  setup() {
    return () => {
      return (
        /*# =admin?<div class={styles.root}>:<> #*/
          <NavBar title="商品列表" onBack />
          <div class=/*# =admin?"g-page-content":{styles.root + ' g-page-content'} #*/>
            <DocumentHead title="商品列表" />
            <div class="note">本页面主要用来演示小程序下的“分包加载”</div>
            <div class="list">
              <div class="item">---商品1---</div>
              <div class="item">---商品2---</div>
              <div class="item">---商品3---</div>
            </div>
          </div>
        /*# =admin?</div>:</> #*/
      );
    };
  },
});
export default exportView(Component);
/*# end #*/
