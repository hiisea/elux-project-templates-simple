/*# if:react #*/
import {Dispatch, Link, LoadingState, connectRedux} from '<%= elux %>';
/*# else:vue #*/
import {ComputedStore, exportView, Link, LoadingState} from '<%= elux %>';
/*# end #*/
/*# if:react #*/
import {FC, ReactNode, useCallback} from 'react';
/*# else:vue #*/
import {computed, defineComponent} from 'vue';
/*# end #*/
import LoadingPanel from '@/components/LoadingPanel';
import {APPState, Modules, StaticPrefix/*# =vue?, useStore: #*/} from '@/Global';
import {CurUser} from '@/modules/stage/entity';
import {Notices, SubModule} from '../../entity';
import styles from './index.module.less';

interface StoreProps {
  dialogMode: boolean;
  curUser: CurUser;
  subModule?: SubModule;
  notices?: Notices;
  globalLoading?: LoadingState;
}

/*# if:react #*/
interface OwnerProps {
  children: ReactNode;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {curUser, globalLoading} = appState.stage!;
  const {dialogMode, subModule, notices} = appState.admin!;
  return {dialogMode, curUser, subModule, notices, globalLoading};
}
/*# else:vue #*/
//这里保持和Redux的风格一致，也可以省去这一步，直接使用computed
function mapStateToProps(appState: APPState): ComputedStore<StoreProps> {
  const stage = appState.stage!;
  const admin = appState.admin!;
  return {
    curUser: () => stage.curUser,
    globalLoading: () => stage.globalLoading,
    subModule: () => admin.subModule,
    dialogMode: () => admin.dialogMode,
    notices: () => admin.notices,
  };
}
/*# end #*/

/*# if:react #*/
const Component: FC<StoreProps & OwnerProps & {dispatch: Dispatch}> = ({
  dialogMode,
  children,
  curUser,
  subModule,
  notices,
  globalLoading,
  dispatch,
}) => {
  const onLogout = useCallback(() => dispatch(Modules.stage.actions.logout()), [dispatch]);

  return dialogMode ? (
    <div className="wrap">
      {children}
      <LoadingPanel loadingState={globalLoading} />
    </div>
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
        <LoadingPanel loadingState={globalLoading} />
      </div>
    </div>
  );
};

export default connectRedux(mapStateToProps)(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'AdminLayout',
  setup(props, context) {
    const store = useStore();
    const computedStore = mapStateToProps(store.getState());
    const curUser = computed(computedStore.curUser);
    const globalLoading = computed(computedStore.globalLoading);
    const subModule = computed(computedStore.subModule);
    const dialogMode = computed(computedStore.dialogMode);
    const notices = computed(computedStore.notices);
    const onLogout = () => store.dispatch(Modules.stage.actions.logout());

    return () => {
      return dialogMode.value ? (
        <div class="wrap">
          {context.slots.default!()}
          <LoadingPanel loadingState={globalLoading.value} />
        </div>
      ) : (
        <div class={styles.root}>
          <div class="side">
            <div class="flag">
              Elux后台管理系统<span class="ver">v1.2</span>
            </div>
            <ul class="nav">
              <li class={`item ${subModule.value === 'article' ? 'on' : ''}`}>
                <Link to="/admin/article/list" action="relaunch" target="window">
                  文章管理
                </Link>
              </li>
              <li class={`item ${subModule.value === 'my' ? 'on' : ''}`}>
                <Link to="/admin/my/userSummary" action="relaunch" target="window">
                  个人中心
                </Link>
              </li>
            </ul>
          </div>
          <div class="main">
            <div class="header">
              <div class="avatar" style={{backgroundImage: `url(${StaticPrefix + curUser.value.avatar})`}} />
              <div class="nickname">{curUser.value.username}</div>
              <div class="notices">{notices.value?.num || '..'}</div>
              <div class="logout" onClick={onLogout}>
                退出登录
              </div>
            </div>
            <div class="content">{context.slots.default!()}</div>
            <LoadingPanel loadingState={globalLoading.value} />
          </div>
        </div>
      );
    };
  },
});

export default exportView(Component);
/*# end #*/
