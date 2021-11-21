declare module '*.vue' {
  import type {DefineComponent} from 'vue';
  import type {EluxComponent} from '@elux/vue-web';
  const component: DefineComponent<any> & EluxComponent;
  export default component;
}
