//通常模块可以定义一个根视图，根视图中显示什么由模块自行决定，父级不干涉，相当于子路由
import {FC} from 'react';
import {Switch, connectRedux, Dispatch} from '@elux/react-web';
import {APPState, LoadComponent} from '@/Global';
import ErrorPage from '@/components/ErrorPage';
import Forbidden from '../components/Forbidden';
import Layout from './Layout';
import {CurUser} from '@/modules/stage/entity';
import {CurModule} from '../entity';

//采用LoadComponent来加载视图，可以懒执行，并自动初始化与之对应的model
//Stage中只显示子模块的根视图，如acticle.main，具体action.main中显示什么由acticle模块自己决定，类似于子路由
const Article = LoadComponent('article', 'main');
const My = LoadComponent('my', 'main');

export interface StoreProps {
  dialogMode: boolean;
  curUser: CurUser;
  curModule: CurModule;
}

function mapStateToProps(appState: APPState): StoreProps {
  const stage = appState.stage!;
  const admin = appState.admin!;
  return {dialogMode: admin.dialogMode, curUser: stage.curUser, curModule: admin.curModule};
}

const Component: FC<StoreProps & {dispatch: Dispatch}> = ({curUser, curModule}) => {
  return curUser.hasLogin ? (
    <Layout>
      <Switch elseView={<ErrorPage />}>
        {curModule === 'article' && <Article />}
        {curModule === 'my' && <My />}
      </Switch>
    </Layout>
  ) : (
    <Forbidden />
  );
};

export default connectRedux(mapStateToProps)(Component);
