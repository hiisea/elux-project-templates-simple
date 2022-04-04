declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.gif';
declare module '*.less';
declare module '*.scss';
/*# if:vue #*/
declare module '*.vue' {
  export default import('<%= elux %>').EluxComponent;
}
/*# end #*/
