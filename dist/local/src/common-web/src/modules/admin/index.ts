//封装并导出本模块
import {exportModule} from '<%= elux %>';
import {Model} from './model';
import main from './views/Main';

export default exportModule('admin', Model, {main});
