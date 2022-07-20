//通常模块可以定义一个根视图，根视图中显示什么由模块自行决定，父级不干涉，相当于子路由
/*# if:react #*/
import {FC} from 'react';
/*# else #*/
import {defineComponent} from 'vue';
/*# end #*/
import {/*# =vue?exportView,: #*/ Switch, connectStore} from '<%= elux %>';
import {CurUser} from '@/modules/stage/entity';
import ErrorPage from '@/components/ErrorPage';
import {APPState, LoadComponent} from '@/Global';
import {SubModule} from '../entity';

//采用LoadComponent来加载视图，可以懒执行，并自动初始化与之对应的model
const My = LoadComponent('my', 'main');

export interface StoreProps {
  curUser: CurUser;
  subModule?: SubModule;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {curUser} = appState.stage!;
  const {subModule} = appState.admin!;
  return {curUser, subModule};
}

/*# if:react #*/
const Component: FC<StoreProps> = ({curUser, subModule}) => {
  if (!curUser.hasLogin) {
    return null;
  }
  return (
    <Switch elseView={<ErrorPage />}>
      {subModule === 'my' && <My />}
    </Switch>
  );
};

//connectRedux中包含了exportView()的执行
export default connectStore(mapStateToProps)(Component);
/*# else #*/
const Component = defineComponent({
  name: 'AdminMain',
  setup() {
    const storeProps = connectStore(mapStateToProps);

    return () => {
      const {curUser, subModule} = storeProps;
      if (!curUser.hasLogin) {
        return null;
      }
      return (
        <Switch elseView={<ErrorPage />}>
          {subModule === 'my' && <My />}
        </Switch>
      );
    };
  },
});

export default exportView(Component);
/*# end #*/
