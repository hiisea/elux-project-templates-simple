declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.gif';
declare module '*.less';
declare module '*.scss';
<% if(render ==='tpl'){ -%>
declare module '*.vue' {
  import type {DefineComponent} from 'vue';
  import type {EluxComponent} from '@elux/vue-web';
  const component: DefineComponent<any> & EluxComponent;
  export default component;
}
<% } -%>
