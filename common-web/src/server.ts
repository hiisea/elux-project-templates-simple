import {createSSR} from '<%= elux %>';
import {moduleGetter} from './Project';

export default function server(request: {url: string}, response: any): Promise<string> {
  return createSSR(moduleGetter, request.url, {request, response}).render();
}
