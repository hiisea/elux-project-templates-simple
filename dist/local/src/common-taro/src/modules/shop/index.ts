import {exportModule} from '<%= elux %>';
import main from './views/Main';
import {Model} from './model';

const shop = exportModule('shop', Model, {main});
export default shop;

export type Shop = typeof shop;
