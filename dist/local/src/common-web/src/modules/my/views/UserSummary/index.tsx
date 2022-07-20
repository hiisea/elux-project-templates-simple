/*# if:react #*/
import {FC, useCallback} from 'react';
/*# else #*/
import {defineComponent} from 'vue';
/*# end #*/
/*# if:!taro #*/
import TabBar from '@/components/TabBar';
/*# end #*/
import {/*# =react?Dispatch,: #*/ DocumentHead, connectStore} from '<%= elux %>';
import {APPState, Modules, StaticPrefix} from '@/Global';
import {Notices} from '@/modules/admin/entity';
import {CurUser} from '@/modules/stage/entity';
import styles from './index.module.less';

interface StoreProps {
  curUser: CurUser;
  notices?: Notices;
}

function mapStateToProps(appState: APPState): StoreProps {
  return {curUser: appState.stage!.curUser, notices: appState.admin!.notices};
}

/*# if:react #*/
const Component: FC<StoreProps & {dispatch: Dispatch}> = ({curUser, notices, dispatch}) => {
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

export default connectStore(mapStateToProps)(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'MyUserSummary',
  setup() {
    const storeProps = connectStore(mapStateToProps);
    const onLogout = () => storeProps.dispatch(Modules.stage.actions.logout());
    
    return () => {
      const {curUser, notices} = storeProps;
      return (
        <>
          <DocumentHead title="个人中心" />
          <div class={`${styles.root} g-page-content`}>
            <div class="title">个人中心</div>
            <div class="avatar" style={{backgroundImage: `url(${StaticPrefix + curUser.avatar})`}} />
            <div class="notices">{notices?.num || '..'}</div>
            <div class="nickname">{curUser.username}</div>
            <div class="score">{`✆ ${curUser.mobile}`}</div>
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

export default Component;
/*# end #*/