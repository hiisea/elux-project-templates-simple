import {APPState, Modules, StaticPrefix, useRouter} from '@/Global';
import {CurUser} from '@/modules/stage/entity';
import {connectRedux, Dispatch, Link} from '@elux/react-web';
import {FC, ReactNode, useCallback} from 'react';
import {CurModule, Notices} from '../../entity';
import styles from './index.module.less';

interface StoreProps {
  dialogMode: boolean;
  curUser: CurUser;
  curModule: CurModule;
  notices: Notices;
}

interface OwnerProps {
  children: ReactNode;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {curUser} = appState.stage!;
  const {dialogMode, curModule, notices} = appState.admin!;
  return {dialogMode, curUser, curModule, notices};
}

const Component: FC<StoreProps & OwnerProps & {dispatch: Dispatch}> = ({dialogMode, children, curUser, curModule, notices, dispatch}) => {
  const router = useRouter();
  const onLogout = useCallback(() => dispatch(Modules.stage.actions.logout()), [dispatch]);

  return dialogMode ? (
    <div>{children}</div>
  ) : (
    <div className={styles.root}>
      <div className="side">
        <div className="flag">
          Elux后台管理系统<span className="ver">v1.2</span>
        </div>
        <ul className="nav">
          <li className={`item ${curModule === 'article' ? 'on' : ''}`}>
            <Link to="/admin/article/list" action="relaunch" target="window">
              文章管理
            </Link>
          </li>
          <li className={`item ${curModule === 'my' ? 'on' : ''}`}>
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
          <div className="notices">{notices.num}</div>
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
