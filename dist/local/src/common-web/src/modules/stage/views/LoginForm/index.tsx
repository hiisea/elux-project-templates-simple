/*# if:react #*/
import {FC, useCallback, useState} from 'react';
/*# else:vue #*/
import {defineComponent, ref} from 'vue';
/*# end #*/
import {DocumentHead, /*# =react?Dispatch, connectRedux:exportView #*/} from '<%= elux %>';
import NavBar from '@/components/NavBar';
import {Modules, useRouter/*# =vue?, useStore: #*/} from '@/Global';
import styles from './index.module.less';

/*# if:react #*/
const Component: FC<{dispatch: Dispatch}> = ({dispatch}) => {
  const router = useRouter();
  const onCancel = useCallback(() => router.back(1, 'window'), [router]);
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
      <DocumentHead title="登录" />
      <NavBar title="登录" />
      <div className={`${styles.root} g-page-content`}>
        <div className="form-body">
          <div className="form-item">
            <div className="label">用户名:</div>
            <div className="item">
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
          <div className="form-item">
            <div className="label">密码:</div>
            <div className="item">
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
          {errorMessage && <div className="error">{`* ${errorMessage}`}</div>}
        </div>
        <div className="form-control">
          <button type="submit" className="g-button primary" onClick={onSubmit}>
            登 录
          </button>
          <button type="button" className="g-button" onClick={onCancel}>
            取 消
          </button>
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
    const router = useRouter();
    const store = useStore();
    const errorMessage = ref('');
    const username = ref('');
    const password = ref('');
    const onCancel = () => router.back(1, 'window');
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
        <DocumentHead title="登录" />
        <NavBar title="登录" />
        <div class={`${styles.root} g-page-content`}>
          <div class="form-body">
            <div class="form-item">
              <div class="label">用户名:</div>
              <div class="item">
                <input name="username" class="g-input" type="text" placeholder="请输入" v-model={username.value} />
              </div>
            </div>
            <div class="form-item">
              <div class="label">密码:</div>
              <div class="item">
                <input name="password" type="password" class="g-input" placeholder="请输入" v-model={password.value} />
              </div>
            </div>
            {errorMessage.value && <div class="error">{`* ${errorMessage.value}`}</div>}
          </div>
          <div class="form-control">
            <button type="submit" class="g-button primary" onClick={onSubmit}>
              登 录
            </button>
            <button type="button" class="g-button" onClick={onCancel}>
              取 消
            </button>
          </div>
        </div>
      </>
    );
  },
});

export default exportView(Component);
/*# end #*/