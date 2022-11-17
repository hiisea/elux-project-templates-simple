import {EluxPage, injectModule} from '<%= elux %>';
import shop from '../index';

//分包加载，动态注册微模块
injectModule(shop);

definePageConfig({
  navigationBarTitleText: '商品列表',
});

export default EluxPage;
