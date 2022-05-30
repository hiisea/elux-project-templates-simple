/*# if:!taro #*/
import TabBar from '@/components/TabBar';
/*# end #*/
import {APPState, Modules, StaticPrefix/*# =vue?, useStore: #*/} from '@/Global';
import {CurUser} from '@/modules/stage/entity';
import {Notices} from '@/modules/admin/entity';
/*# if:react #*/
import {connectRedux, Dispatch, DocumentHead} from '<%= elux %>';
/*# else:vue #*/
import {ComputedStore, DocumentHead, exportView} from '<%= elux %>';
/*# end #*/
/*# if:react #*/
import {FC, useCallback} from 'react';
/*# else:vue #*/
import {computed, defineComponent} from 'vue';
/*# end #*/
import styles from './index.module.less';

interface StoreProps {
  curUser: CurUser;
  notices?: Notices;
}

/*# if:react #*/
function mapStateToProps(appState: APPState): StoreProps {
  return {curUser: appState.stage!.curUser, notices: appState.admin!.notices};
}

interface DispatchProps {
  dispatch: Dispatch;
}
/*# else:vue #*/
//这里保持和Redux的风格一致，也可以省去这一步，直接使用computed
function mapStateToProps(appState: APPState): ComputedStore<StoreProps> {
  return {
    curUser: () => appState.stage!.curUser,
    notices: () => appState.admin!.notices,
  };
}
/*# end #*/

/*# if:react #*/
const Component: FC<StoreProps & DispatchProps> = ({curUser, notices, dispatch}) => {
  const onLogout = useCallback(() => dispatch(Modules.stage.actions.logout()), [dispatch]);

  return (
    <>
      <DocumentHead title="个人中心" />
      <div className={`${styles.root} g-page-content`}>
        <div className="title">个人中心</div>
        <div className="avatar" style={{backgroundImage: `url(${StaticPrefix + curUser.avatar})`}} />
        <div className="notices">{notices?.num || '..'}</div>
        <div className="nickname">{curUser.username}</div>
        <div className="score">{`✆ ${curUser.mobile}`}</div>
        <div className="logout" onClick={onLogout}>
          退出登录
        </div>
      </div>
      /*# if:!taro #*/
      <TabBar selected="my" />
      /*# end #*/
    </>
  );
};

export default connectRedux(mapStateToProps)(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'MyUserSummary',
  setup() {
    const store = useStore();
    const computedStore = mapStateToProps(store.getState());
    const curUser = computed(computedStore.curUser);
    const notices = computed(computedStore.notices);
    const onLogout = () => store.dispatch(Modules.stage.actions.logout());
    
    return () => {
      return (
        <>
          <DocumentHead title="个人中心" />
          <div class={`${styles.root} g-page-content`}>
            <div class="title">个人中心</div>
            <div class="avatar" style={{backgroundImage: `url(${StaticPrefix + curUser.value.avatar})`}} />
            <div class="notices">{notices.value?.num || '..'}</div>
            <div class="nickname">{curUser.value.username}</div>
            <div class="score">{`✆ ${curUser.value.mobile}`}</div>
            <div class="logout" onClick={onLogout}>
              退出登录
            </div>
          </div>
          /*# if:!taro #*/
          <TabBar selected="my" />
          /*# end #*/
        </>
      );
    };
  },
});

export default exportView(Component);
/*# end #*/