/*# if:react #*/
import {Dispatch, Link, connectRedux} from '<%= elux %>';
import {FC, ReactNode, useCallback} from 'react';
/*# else:vue #*/
import {ComputedStore, exportView, Link} from '<%= elux %>';
import {computed, defineComponent} from 'vue';
/*# end #*/
import {APPState, Modules, StaticPrefix/*# =vue?, useStore: #*/} from '@/Global';
import {CurUser} from '@/modules/stage/entity';
import {Notices, SubModule} from '../../entity';
import styles from './index.module.less';

interface StoreProps {
  curUser: CurUser;
  subModule?: SubModule;
  notices?: Notices;
}

/*# if:react #*/
interface OwnerProps {
  children: ReactNode;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {curUser} = appState.stage!;
  const {subModule, notices} = appState.admin!;
  return {curUser, subModule, notices};
}
/*# else:vue #*/
//这里保持和Redux的风格一致，也可以省去这一步，直接使用computed
function mapStateToProps(appState: APPState): ComputedStore<StoreProps> {
  const stage = appState.stage!;
  const admin = appState.admin!;
  return {
    curUser: () => stage.curUser,
    subModule: () => admin.subModule,
    notices: () => admin.notices,
  };
}
/*# end #*/

/*# if:react #*/
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

export default connectRedux(mapStateToProps)(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'AdminLayout',
  setup(props, context) {
    const store = useStore();
    const computedStore = mapStateToProps(store.getState());
    const curUser = computed(computedStore.curUser);
    const subModule = computed(computedStore.subModule);
    const notices = computed(computedStore.notices);
    const onLogout = () => store.dispatch(Modules.stage.actions.logout());

    return () => (
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
        </div>
      </div>
    );
  },
});

export default exportView(Component);
/*# end #*/
