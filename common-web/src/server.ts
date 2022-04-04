import {createSSR} from '<%= elux %>';
import {appConfig} from './Project';

export default function server(request: {url: string}, response: any): Promise<string> {
  return createSSR(appConfig, {request, response}).render();
}
