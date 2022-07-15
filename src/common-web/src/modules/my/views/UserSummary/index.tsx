/*# if:react #*/
import {Dispatch, DocumentHead, connectRedux} from '<%= elux %>';
import {FC, useCallback} from 'react';
import {APPState, Modules, StaticPrefix} from '@/Global';
import {Notices} from '@/modules/admin/entity';
import {CurUser} from '@/modules/stage/entity';
/*# else #*/
import {DocumentHead, exportView} from '<%= elux %>';
import {computed, defineComponent} from 'vue';
import {Modules, StaticPrefix, useStore} from '@/Global';
/*# end #*/
/*# if:!taro #*/
import TabBar from '@/components/TabBar';
/*# end #*/
import styles from './index.module.less';

/*# if:react #*/
interface StoreProps {
  curUser: CurUser;
  notices?: Notices;
}

function mapStateToProps(appState: APPState): StoreProps {
  return {curUser: appState.stage!.curUser, notices: appState.admin!.notices};
}

interface DispatchProps {
  dispatch: Dispatch;
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
    const curUser = computed(() => store.state.stage!.curUser);
    const notices = computed(() => store.state.admin!.notices);
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