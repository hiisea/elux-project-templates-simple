/*# if:react #*/
import {FC, ReactNode} from 'react';
/*# else:vue #*/
import {FunctionalComponent, VNode} from 'vue';
/*# end #*/
import {DocumentHead, Link} from '<%= elux %>';
import styles from './index.module.less';

export interface Props {
  /*# =react?className:class #*/?: string;
  title?: string;
  subject?: string;
  /*# if:react #*/
  children?: ReactNode;
  /*# end #*/
  maskClosable?: boolean;
  mask?: boolean;
  backOverflowRedirect?: string;
}

/*# if:react #*/
const Component: FC<Props> = (props) => {
  const {className = '', title, subject, children, maskClosable = false, mask, backOverflowRedirect} = props;

  return (
    <>
      <div className={`${styles.root} ${className}`}>
        {title && <DocumentHead title={title} />}
        <div className="brand">
          Elux-管理系统<span className="ver"> V1.0</span>
        </div>
        <div className="content">
          {subject && <h2 className="subject">{subject}</h2>}
          {children}
        </div>
      </div>
      <Link
        disabled={!maskClosable}
        className={`${styles.mask} ${!mask ? 'no-mask' : ''}`}
        to={1}
        action="back"
        target="window"
        overflowRedirect={backOverflowRedirect}
      ></Link>
    </>
  );
};
/*# else #*/
const Component: FunctionalComponent<Props> = function (
  props: Props,
  context: {slots: {default?: () => VNode[];}}
) {
  const {class: className = '', title, subject, maskClosable = false, mask, backOverflowRedirect} = props;

  return (
    <>
      <div class={`${styles.root} ${className}`}>
        {title && <DocumentHead title={title} />}
        <div class="brand">
          Elux-管理系统<span class="ver"> V1.0</span>
        </div>
        <div class="content">
          {subject && <h2 class="subject">{subject}</h2>}
          {context.slots.default!()}
        </div>
      </div>
      <Link
        disabled={!maskClosable}
        class={`${styles.mask} ${!mask ? 'no-mask' : ''}`}
        to={1}
        action="back"
        target="window"
        overflowRedirect={backOverflowRedirect}
      ></Link>
    </>
  );
} as any;

Component.displayName = 'DialogPage';
/*# end #*/


export default Component;
