//该文件为SSR服务器渲染时，server端入口文件
import {createSSR} from '<%= elux %>';
import {appConfig} from './Project';

/**
 * 该方法最终将被Web应用框架调用，参数依据所选web应用框架(如express/kao/nestjs)的不同可以自己变化，
 * 而这些原始入参都可以原封不动的传给`createSSR(...)`后，通过`router.initOptions`可以获取
 */
export default function server(request: {url: string}, response: any): Promise<string> {
  return createSSR(appConfig, {url: request.url, request, response} as any).render();
}
