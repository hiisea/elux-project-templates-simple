/*# if:react #*/
import {Dispatch, Link, connectRedux} from '<%= elux %>';
/*# else:vue #*/
import {ComputedStore, exportView, Link} from '<%= elux %>';
/*# end #*/
/*# if:react #*/
import {FC, ReactNode, useCallback} from 'react';
/*# else:vue #*/
import {computed, defineComponent} from 'vue';
/*# end #*/
import {APPState, Modules, StaticPrefix} from '@/Global';
import {CurUser} from '@/modules/stage/entity';
import {Notices, SubModule} from '../../entity';
import styles from './index.module.less';

interface StoreProps {
  dialogMode: boolean;
  curUser: CurUser;
  subModule?: SubModule;
  notices?: Notices;
}

interface OwnerProps {
  children: ReactNode;
}

/*# if:react #*/
function mapStateToProps(appState: APPState): StoreProps {
  const {curUser} = appState.stage!;
  const {dialogMode, subModule, notices} = appState.admin!;
  return {dialogMode, curUser, subModule, notices};
}
/*# else:vue #*/
//这里保持和Redux的风格一致，也可以省去这一步，直接使用computed
function mapStateToProps(appState: APPState): ComputedStore<StoreProps> {
  const stage = appState.stage!;
  const admin = appState.admin!;
  return {
    curUser: () => stage.curUser,
    subModule: () => admin.subModule,
    dialogMode: () => admin.dialogMode,
    notices: () => admin.notices,
  };
}
/*# end #*/

/*# if:react #*/
const Component: FC<StoreProps & OwnerProps & {dispatch: Dispatch}> = ({dialogMode, children, curUser, subModule, notices, dispatch}) => {
  const onLogout = useCallback(() => dispatch(Modules.stage.actions.logout()), [dispatch]);

  return dialogMode ? (
    <div className="wrap">{children}</div>
  ) : (
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

export default connectRedux(mapStateToProps)(Component);
/*# else:vue #*/

/*# end #*/
