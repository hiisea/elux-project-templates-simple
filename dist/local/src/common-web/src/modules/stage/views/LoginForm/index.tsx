/*# if:!admin #*/
import NavBar from '@/components/NavBar';
/*# else #*/
import DialogPage from '@/components/DialogPage';
/*# end #*/
/*# if:react #*/
import {connectStore, /*# =!admin?DocumentHead, : #*/Dispatch/*# =!taro?, Link: #*/} from '<%= elux %>';
import {FC, useCallback, useState} from 'react';
/*# else:vue #*/
import {connectStore, /*# =!admin?DocumentHead, : #*/exportView/*# =!taro?, Link: #*/} from '<%= elux %>';
import {defineComponent, ref} from 'vue';
/*# end #*/
/*# if:taro #*/
import {navigateTo} from '@tarojs/taro';
/*# end #*/
import {GetActions} from '@/Global';
import styles from './index.module.less';

const {stage: stageActions} = GetActions('stage');

/*# if:react #*/
const Component: FC<{dispatch: Dispatch}> = ({dispatch}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const onSubmit = useCallback(() => {
    if (!username || !password) {
      setErrorMessage('请输入用户名、密码');
    } else {
      //这样的写法可以使用TS的类型提示，等同于dispatch({type:'stage.login',payload:{username, password}})
      //可以await这个action的所有handler执行完成
      const result = dispatch(stageActions.login({username, password})) as Promise<void>;
      result.catch(({message}) => {
        setErrorMessage(message);
      });
    }
  }, [dispatch, password, username]);
  const onCancel = useCallback(() => {
    dispatch(stageActions.cancelLogin());
  }, [dispatch]);
  /*# if:taro #*/
  const onNavToShop = useCallback(() => navigateTo({url: '/modules/shop/pages/list'}), []);
  /*# end #*/

  return (
    /*# if:admin #*/
    <DialogPage title="用户登录" subject="用户登录">
      <div className={`${styles.root} g-dialog-content`}>
    /*# else #*/
    <>
      <NavBar title="登录" />
      <div className={`${styles.root} g-page-content`}>
        <DocumentHead title="登录" />
    /*# end #*/
        <div className="g-form">
          <div className="item">
            <div className="item">用户名</div>
            <div className="item">
              <input
                name="username"
                type="text"
                className="g-input"
                placeholder="请输入"
                onChange={(e) => setUsername(e.target.value.trim())}
                value={username}
              />
            </div>
          </div>
          <div className="item item-last">
            <div className="item">密码</div>
            <div className="item">
              <input
                name="password"
                type="text"
                className="g-input"
                placeholder="请输入"
                onChange={(e) => setPassword(e.target.value.trim())}
                value={password}
              />
            </div>
          </div>
          <div className="item item-error">
            <div className="item"></div>
            <div className="item">{errorMessage}</div>
          </div>
        </div>
        <div className="g-control">
          <button type="submit" className="g-button primary" onClick={onSubmit}>
            登 录
          </button>
          <button type="button" className="g-button" onClick={onCancel}>
            取 消
          </button>
        </div>
        /*# if:taro #*/
        <div className="g-ad" onClick={onNavToShop}>
          -- 特惠商城，盛大开业 --
        </div>
        /*# else #*/
        <Link className="g-ad" to="/shop/list" action="push" target="window" cname="">
          -- 特惠商城，盛大开业 --
        </Link>
        /*# end #*/
      </div>
    /*# =admin?</DialogPage>:</> #*/
  );
};

//connectRedux中包含了exportView()的执行
export default connectStore()(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'StageLoginForm',
  setup() {
    const storeProps = connectStore();
    const errorMessage = ref('');
    const username = ref('admin');
    const password = ref('123456');
    const onSubmit = () => {
      if (!username.value || !password.value) {
        errorMessage.value = '请输入用户名、密码';
      } else {
        //这样的写法可以使用TS的类型提示，等同于dispatch({type:'stage.login',payload:{username, password}})
        //可以await这个action的所有handler执行完成
        const result = storeProps.dispatch(stageActions.login({username: username.value, password: password.value})) as Promise<void>;
        result.catch(({message}) => {
          errorMessage.value = message;
        });
      }
    };
    const onCancel = () => {
      storeProps.dispatch(stageActions.cancelLogin());
    };
    /*# if:taro #*/
    const onNavToShop = () => navigateTo({url: '/modules/shop/pages/list'});
    /*# end #*/

    return () => (
      /*# if:admin #*/
      <DialogPage title="用户登录" subject="用户登录">
        <div class={`${styles.root} g-dialog-content`}>
      /*# else #*/
      <>
        <NavBar title="登录" />
        <div class={`${styles.root} g-page-content`}>
          <DocumentHead title="登录" />
      /*# end #*/
          <div class="g-form">
            <div class="item">
              <div class="item">用户名</div>
              <div class="item">
                <input name="username" class="g-input" type="text" placeholder="请输入" v-model={username.value} />
              </div>
            </div>
            <div class="item item-last">
              <div class="item">密码</div>
              <div class="item">
                <input name="password" class="g-input" type="text" placeholder="请输入" v-model={password.value} />
              </div>
            </div>
            <div class="item item-error">
              <div class="item"></div>
              <div class="item">{errorMessage.value}</div>
            </div>
          </div>
          <div class="g-control">
            <button type="submit" class="g-button primary" onClick={onSubmit}>
              登 录
            </button>
            <button type="button" class="g-button" onClick={onCancel}>
              取 消
            </button>
          </div>
          /*# if:taro #*/
          <div class="g-ad" onClick={onNavToShop}>
            -- 特惠商城，盛大开业 --
          </div>
          /*# else #*/
          <Link class="g-ad" to="/shop/list" action="push" target="window" cname="">
            -- 特惠商城，盛大开业 --
          </Link>
          /*# end #*/
        </div>
      /*# =admin?</DialogPage>:</> #*/
    );
  },
});

export default exportView(Component);
/*# end #*/