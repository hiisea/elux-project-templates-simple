/// <reference types="@tarojs/taro" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';
/*# if:vue #*/
declare module '*.vue' {
  const Component: (props: any) => JSX.Element;
  export default Component;
}
/*# end #*/


declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd';
  }
}
/*# if:react #*/

declare namespace React {
  // eslint-disable-next-line
  interface TextareaHTMLAttributes<T> {
    maxlength: number;
  }
}
/*# end #*/
