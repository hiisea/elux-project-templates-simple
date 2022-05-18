declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.gif';
declare module '*.less';
declare module '*.scss';
/*# if:vue #*/
declare module '*.vue' {
  const Component: (props: any) => JSX.Element;
  export default Component;
}
/*# end #*/
