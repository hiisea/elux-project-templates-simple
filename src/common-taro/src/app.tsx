import {createApp} from '<%= elux %>';
import {appConfig} from './Project';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
/*# if:react #*/
function App(props: any) {
  const Provider = createApp(appConfig);
  return <Provider>{props.children}</Provider>;
}
/*# else #*/
const App = createApp(appConfig);
/*# end #*/

export default App;
