import {exportModule} from '<%= elux %>';
import main from './views/Main';
import {Model} from './model';

export default exportModule('my', Model, {main});
