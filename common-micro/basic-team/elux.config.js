const {localIP} = require('@elux/cli-utils');
const apiHost = `http://${localIP}:3003/`;
module.exports = {
  type: '<%= framework %>',
  mockServer: {port: 3003, dir: '../app-api'},
  cssProcessors: {/*# =less?less:sass #*/: true},
  all: {
    //开发和生成环境都使用的配置
    serverPort: 4003,
    clientGlobalVar: {
      ApiPrefix: apiHost,
      StaticPrefix: apiHost,
    },
  },
  dev: {
    //开发环境专用配置
    eslint: false,
    stylelint: false,
    clientGlobalVar: {
      ApiPrefix: '/api/',
    },
    apiProxy: {
      '/api': {
        target: apiHost,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
};
