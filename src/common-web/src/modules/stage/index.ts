//封装并导出本模块
import {exportModule} from '<%= elux %>';
import main from './views/Main';
import {Model} from './model';

export default exportModule('stage', Model, {main});
