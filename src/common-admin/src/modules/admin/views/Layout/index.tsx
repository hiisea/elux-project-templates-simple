/*# if:react #*/
import {FC, ReactNode, useCallback} from 'react';
/*# else #*/
import {defineComponent} from 'vue';
/*# end #*/
import {/*# =react?Dispatch,: #*/ connectStore, Link} from '<%= elux %>';
import {CurUser} from '@/modules/stage/entity';
import {APPState, Modules, StaticPrefix} from '@/Global';
import {Notices, SubModule} from '../../entity';
import styles from './index.module.less';

interface StoreProps {
  curUser: CurUser;
  subModule?: SubModule;
  notices?: Notices;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {curUser} = appState.stage!;
  const {subModule, notices} = appState.admin!;
  return {curUser, subModule, notices};
}

/*# if:react #*/
interface OwnerProps {
  children: ReactNode;
}

const Component: FC<StoreProps & OwnerProps & {dispatch: Dispatch}> = ({
  children,
  curUser,
  subModule,
  notices,
  dispatch,
}) => {
  const onLogout = useCallback(() => dispatch(Modules.stage.actions.logout()), [dispatch]);

  return (
    <div className={styles.root}>
      <div className="side">
        <div className="flag">
          Elux后台管理系统<span className="ver">v1.2</span>
        </div>
        <ul className="nav">
          <li className={`item ${subModule === 'article' ? 'on' : ''}`}>
            <Link to="/admin/article/list" action="relaunch" target="window">
              文章管理
            </Link>
          </li>
          <li className={`item ${subModule === 'my' ? 'on' : ''}`}>
            <Link to="/admin/my/userSummary" action="relaunch" target="window">
              个人中心
            </Link>
          </li>
        </ul>
      </div>
      <div className="main">
        <div className="header">
          <div className="avatar" style={{backgroundImage: `url(${StaticPrefix + curUser.avatar})`}} />
          <div className="nickname">{curUser.username}</div>
          <div className="notices">{notices?.num || '..'}</div>
          <div className="logout" onClick={onLogout}>
            退出登录
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default connectStore(mapStateToProps)(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'AdminLayout',
  setup(props, context) {
    const storeProps = connectStore(mapStateToProps);
    const onLogout = () => storeProps.dispatch(Modules.stage.actions.logout());

    return () => {
      const {notices, subModule, curUser} = storeProps;
      return (
        <div class={styles.root}>
          <div class="side">
            <div class="flag">
              Elux后台管理系统<span class="ver">v1.2</span>
            </div>
            <ul class="nav">
              <li class={`item ${subModule === 'article' ? 'on' : ''}`}>
                <Link to="/admin/article/list" action="relaunch" target="window">
                  文章管理
                </Link>
              </li>
              <li class={`item ${subModule === 'my' ? 'on' : ''}`}>
                <Link to="/admin/my/userSummary" action="relaunch" target="window">
                  个人中心
                </Link>
              </li>
            </ul>
          </div>
          <div class="main">
            <div class="header">
              <div class="avatar" style={{backgroundImage: `url(${StaticPrefix + curUser.avatar})`}} />
              <div class="nickname">{curUser.username}</div>
              <div class="notices">{notices?.num || '..'}</div>
              <div class="logout" onClick={onLogout}>
                退出登录
              </div>
            </div>
            <div class="content">{context.slots.default!()}</div>
          </div>
        </div>
      );
    };
  },
});

export default Component;
/*# end #*/
