import {exportModule} from '<%= elux %>';
import {Model} from './model';
import main from './views/Main';

export default exportModule('article', Model, {main});
