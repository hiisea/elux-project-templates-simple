import {EluxPage, injectModule} from '<%= elux %>';
import shop from '../index';

injectModule(shop);

definePageConfig({
  navigationBarTitleText: '商品列表',
});

export default EluxPage;
