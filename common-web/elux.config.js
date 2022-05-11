//工程配置文件，参见 https://eluxjs.com/guide/configure.html
<%
  const typeMap = {
    'react-csr': 'react',
    'react-micro': 'react',
    'react-ssr': 'react ssr',
    'vue-csr': 'vue',
    'vue-micro': 'vue',
    'vue-ssr': 'vue ssr',
  };
  const type = typeMap[framework + '-' + platform];
-%>
const {localIP} = require('@elux/cli-utils');
const serverPort = 4003;
/*# if:ssr #*/
const testUrl = `http://${localIP}:${serverPort}`;
/*# end #*/
const apiHosts = {
  local: `http://${localIP}:3003/`,
  test: 'http://10.201.0.212:31088/',
};
const APP_ENV = process.env.APP_ENV || 'local';
module.exports = {
  type: '<%= type %>',
  mockServer: {port: 3003},
  cssProcessors: {/*# =less?less:sass #*/: true},
  all: {
    //开发和生成环境都使用的配置
    serverPort,
    clientGlobalVar: {
      ApiPrefix: apiHosts[APP_ENV],
      StaticPrefix: apiHosts[APP_ENV],
    },
    /*# if:ssr #*/
    serverGlobalVar: {
      ApiPrefix: apiHosts[APP_ENV],
      StaticPrefix: apiHosts[APP_ENV],
    },
    /*# end #*/
  },
  dev: {
    //开发环境专用配置
    eslint: false,
    stylelint: false,
    //要使用开发代理可以放开下面代码
    // apiProxy: {
    //   '/api': {
    //     target: apiHosts[APP_ENV],
    //     pathRewrite: {
    //       '^/api': '',
    //     },
    //   },
    // },
  },
/*# if:ssr #*/
  //Static Site Generation (SSG)
  gen: {
    override: true,
    entries: [
      (env) => [
        {url: `${testUrl}/`, dist: `./dist/${env}-gen/index.html`},
        {url: `${testUrl}/stage/login`, dist: `./dist/${env}-gen/stage/login.html`},
      ],
      (env) => {
        return new Array(10)
          .fill(0)
          .map((_, index) => ({url: `${testUrl}/article/list?pageCurrent=${index + 1}`, dist: `./dist/${env}-gen/article/list/${index + 1}.html`}));
      },
      (env) => {
        return new Array(10)
          .fill(0)
          .map((_, index) => ({url: `${testUrl}/article/detail?id=${index + 1}`, dist: `./dist/${env}-gen/article/detail/${index + 1}.html`}));
      },
    ],
  },
/*# end #*/
};
