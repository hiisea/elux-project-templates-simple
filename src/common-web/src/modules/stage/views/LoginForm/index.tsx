import NavBar from '@/components/NavBar';
import {Modules/*# =vue?, useStore: #*/} from '@/Global';
/*# if:react #*/
import {connectRedux, Dispatch, DocumentHead, Link} from '<%= elux %>';
/*# else:vue #*/
import {DocumentHead, exportView, Link} from '<%= elux %>';
/*# end #*/
/*# if:react #*/
import {FC, useCallback, useState} from 'react';
/*# else:vue #*/
import {defineComponent, ref} from 'vue';
/*# end #*/
import styles from './index.module.less';

/*# if:react #*/
const Component: FC<{dispatch: Dispatch}> = ({dispatch}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const onSubmit = useCallback(() => {
    if (!username || !password) {
      setErrorMessage('请输入用户名、密码');
    } else {
      //这样的写法可以使用TS的类型提示，等同于dispatch({type:'stage.login',payload:{username, password}})
      //可以await这个action的所有handler执行完成
      const result = dispatch(Modules.stage.actions.login({username, password})) as Promise<void>;
      result.catch(({message}) => {
        setErrorMessage(message);
      });
    }
  }, [dispatch, password, username]);

  return (
    <>
      <NavBar title="登录" />
      <div className={`${styles.root} g-page-content`}>
        <DocumentHead title="登录" />
        <div className="g-form">
          <div>
            <div>用户名</div>
            <div>
              <input
                name="username"
                className="g-input"
                type="text"
                placeholder="请输入"
                onChange={(e) => setUsername(e.target.value.trim())}
                value={username}
              />
            </div>
          </div>
          <div className="item-last">
            <div>密码</div>
            <div>
              <input
                name="password"
                type="password"
                className="g-input"
                placeholder="请输入"
                onChange={(e) => setPassword(e.target.value.trim())}
                value={password}
              />
            </div>
          </div>
          <div className="item-error">
            <div></div>
            <div>{errorMessage}</div>
          </div>
        </div>
        <div className="g-control">
          <button type="submit" className="g-button primary" onClick={onSubmit}>
            登 录
          </button>
          <Link className="g-button" to={1} action="back" target="window">
            取 消
          </Link>
        </div>
      </div>
    </>
  );
};

//connectRedux中包含了exportView()的执行
export default connectRedux()(Component);
/*# else:vue #*/
const Component = defineComponent({
  name: 'StageLoginForm',
  setup() {
    const store = useStore();
    const errorMessage = ref('');
    const username = ref('');
    const password = ref('');
    const onSubmit = () => {
      if (!username.value || !password.value) {
        errorMessage.value = '请输入用户名、密码';
      } else {
        //这样的写法可以使用TS的类型提示，等同于dispatch({type:'stage.login',payload:{username, password}})
        //可以await这个action的所有handler执行完成
        const result = store.dispatch(Modules.stage.actions.login({username: username.value, password: password.value})) as Promise<void>;
        result.catch(({message}) => {
          errorMessage.value = message;
        });
      }
    };
    return () => (
      <>
        <NavBar title="登录" />
        <div class={`${styles.root} g-page-content`}>
          <DocumentHead title="登录" />
          <div class="g-form">
            <div>
              <div>用户名:</div>
              <div class="item">
                <input name="username" class="g-input" type="text" placeholder="请输入" v-model={username.value} />
              </div>
            </div>
            <div class="item-last">
              <div>密码:</div>
              <div class="item">
                <input name="password" type="password" class="g-input" placeholder="请输入" v-model={password.value} />
              </div>
            </div>
            <div class="item-error">
              <div></div>
              <div>{errorMessage.value}</div>
            </div>
          </div>
          <div class="g-control">
            <button type="submit" class="g-button primary" onClick={onSubmit}>
              登 录
            </button>
            <Link class="g-button" to={1} action="back" target="window">
              取 消
            </Link>
          </div>
        </div>
      </>
    );
  },
});

export default exportView(Component);
/*# end #*/