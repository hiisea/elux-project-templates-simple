//该文件为SSR服务器渲染时，server端入口文件
import {createSSR} from '<%= elux %>';
import {appConfig} from './Project';

/**
 * 该方法最终将被Server框架调用，参数依据所选Server框架(如express/kao/nestjs)的不同而变化，
 * 框架的request和response对象传给createSSR后，在应用中可以通过`router.initOptions`获取
 */
export default function server(request: {url: string}, response: any): Promise<string> {
  return createSSR(appConfig, {url: request.url, request, response}).render();
}
