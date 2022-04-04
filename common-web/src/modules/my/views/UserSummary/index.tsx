/*# if:react #*/
import {FC, useCallback} from 'react';
/*# else:vue #*/
import {defineComponent, computed} from 'vue';
/*# end #*/
import {DocumentHead, /*# =react?Dispatch, connectRedux:ComputedStore, exportView #*/} from '<%= elux %>';
import {Modules, APPState, StaticPrefix, useRouter/*# =vue?, useStore: #*/} from '@/Global';
import {LoginUrl} from '@/utils/const';
import {CurUser} from '@/modules/stage/entity';
import TabBar from '@/components/TabBar';
import styles from './index.module.less';

interface StoreProps {
  curUser: CurUser;
}

/*# if:react #*/
function mapStateToProps(appState: APPState): StoreProps {
  const stage = appState.stage!;
  return {curUser: stage.curUser};
}

interface DispatchProps {
  dispatch: Dispatch;
}
/*# else:vue #*/
function mapStateToProps(appState: APPState): ComputedStore<StoreProps> {
  const stage = appState.stage!;
  return {
    curUser: () => stage.curUser,
  };
}
/*# end #*/

/*# if:react #*/
const Component: FC<StoreProps & DispatchProps> = ({curUser, dispatch}) => {
  const router = useRouter();
  const onLogin = useCallback(() => router.push({url: LoginUrl}), [router]);
  const onLogout = useCallback(() => dispatch(Modules.stage.actions.logout()), [dispatch]);

  return (
    <>
      <DocumentHead title="个人中心" />
      <div className={`${styles.root} g-page-content`}>
        <div className="title">个人中心</div>
        <div className="avatar" style={{backgroundImage: `url(${StaticPrefix + curUser.avatar})`}} />
        {curUser.hasLogin ? (
          <>
            <div className="nickname">{curUser.username}</div>
            <div className="score">{`✆ ${curUser.mobile}`}</div>
            <div className="logout" onClick={onLogout}>
              退出登录
            </div>
          </>
        ) : (
          <>
            <div className="nickname">游客</div>
            <div className="login" onClick={onLogin}>
              登 录
            </div>
          </>
        )}
      </div>
      <TabBar selected="my" />
    </>
  );
};

export default connectRedux(mapStateToProps)(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'MyUserSummary',
  setup() {
    const router = useRouter();
    const store = useStore();
    const computedStore = mapStateToProps(store.getState());
    const curUser = computed(computedStore.curUser);
    const onLogin = () => router.push({url: LoginUrl});
    const onLogout = () => store.dispatch(Modules.stage.actions.logout());
    return {curUser, onLogin, onLogout, StaticPrefix};
  },
  render() {
    const {curUser, onLogin, onLogout} = this;

    return (
      <>
        <DocumentHead title="个人中心" />
        <div class={`${styles.root} g-page-content`}>
          <div class="title">个人中心</div>
          <div class="avatar" style={{backgroundImage: `url(${StaticPrefix + curUser.avatar})`}} />
          {curUser.hasLogin ? (
            <>
              <div class="nickname">{curUser.username}</div>
              <div class="score">{`✆ ${curUser.mobile}`}</div>
              <div class="logout" onClick={onLogout}>
                退出登录
              </div>
            </>
          ) : (
            <>
              <div class="nickname">游客</div>
              <div class="login" onClick={onLogin}>
                登 录
              </div>
            </>
          )}
        </div>
        <TabBar selected="my" />
      </>
    );
  },
});

export default exportView(Component);
/*# end #*/