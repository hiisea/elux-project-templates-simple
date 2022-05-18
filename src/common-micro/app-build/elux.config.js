//工程配置文件，参见 https://eluxjs.com/guide/configure.html
const {localIP} = require('@elux/cli-utils');
const apiHosts = {
  local: `http://${localIP}:3003/`,
  test: 'http://10.201.0.212:31088/',
};
const APP_ENV = process.env.APP_ENV || 'local';
module.exports = {
  type: '<%= framework %>',
  mockServer: {port: 3003, dir: '../app-api'},
  cssProcessors: {/*# =less?less:sass #*/: true},
  all: {
    //开发和生成环境都使用的配置
    serverPort: 4003,
    clientGlobalVar: {
      ApiPrefix: apiHosts[APP_ENV],
      StaticPrefix: apiHosts[APP_ENV],
    },
  },
  dev: {
    //开发环境专用配置
    eslint: false,
    stylelint: false,
    apiProxy: {
      '/api': {
        target: apiHosts[APP_ENV],
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
};
