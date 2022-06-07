import {APPState, StaticPrefix/*# =vue?, useStore: #*/} from '@/Global';
import {CurUser} from '@/modules/stage/entity';
/*# if:react #*/
import {connectRedux, DocumentHead} from '<%= elux %>';
/*# else:vue #*/
import {ComputedStore, DocumentHead, exportView} from '<%= elux %>';
/*# end #*/
/*# if:react #*/
import {FC} from 'react';
/*# else:vue #*/
import {computed, defineComponent} from 'vue';
/*# end #*/
import styles from './index.module.less';

interface StoreProps {
  curUser: CurUser;
}

/*# if:react #*/
function mapStateToProps(appState: APPState): StoreProps {
  return {curUser: appState.stage!.curUser};
}
/*# else:vue #*/
//这里保持和Redux的风格一致，也可以省去这一步，直接使用computed
function mapStateToProps(appState: APPState): ComputedStore<StoreProps> {
  return {
    curUser: () => appState.stage!.curUser,
  };
}
/*# end #*/

/*# if:react #*/
const Component: FC<StoreProps> = ({curUser}) => {
  return (
    <div className={`${styles.root} g-page-content`}>
      <DocumentHead title="个人中心" />
      <h2>个人中心</h2>
      <ul className="g-form">
        <li className="item">
          <label className="item">头像</label>
          <div className="item">
            <div className="avatar" style={{backgroundImage: `url(${StaticPrefix + curUser.avatar})`}} />
          </div>
        </li>
        <li className="item">
          <label className="item">昵称</label>
          <div className="item">
            <input disabled name="username" className="g-input" type="text" value={curUser.username} />
          </div>
        </li>
        <li className="item">
          <label className="item">电话</label>
          <div className="item">
            <input disabled name="mobile" className="g-input" type="text" value={curUser.mobile} />
          </div>
        </li>
      </ul>
    </div>
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
    
    return () => {
      return (
        <div class={`${styles.root} g-page-content`}>
          <DocumentHead title="个人中心" />
          <h2>个人中心</h2>
          <ul class="g-form">
            <li class="item">
              <label class="item">头像</label>
              <div class="item">
                <div class="avatar" style={{backgroundImage: `url(${StaticPrefix + curUser.value.avatar})`}} />
              </div>
            </li>
            <li class="item">
              <label class="item">昵称</label>
              <div class="item">
                <input disabled name="username" class="g-input" type="text" value={curUser.value.username} />
              </div>
            </li>
            <li class="item">
              <label class="item">电话</label>
              <div class="item">
                <input disabled name="mobile" class="g-input" type="text" value={curUser.value.mobile} />
              </div>
            </li>
          </ul>
        </div>
      );
    };
  },
});

export default exportView(Component);
/*# end #*/