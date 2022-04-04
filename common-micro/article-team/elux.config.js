const {localIP} = require('@elux/cli-utils');
const apiHost = `http://${localIP}:3003/`;
module.exports = {
  type: '<%= framework %>',
  mockServer: {port: 3003, dir: '../app-api'},
  cssProcessors: {/*# =less?less:sass #*/: true},
  all: {
    //开发和生成环境都使用的配置
    serverPort: 4001,
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
  moduleFederation: {
    name: 'articleTeam',
    filename: 'remote.js',
    exposes: {
      './modules/article': './src/modules/article',
    },
    shared: {
      /*# if:react #*/
      react: {singleton: true, eager: true, requiredVersion: '*'},
      'react-dom': {singleton: true, eager: true, requiredVersion: '*'},
      /*# else:vue #*/
      vue: {singleton: true, eager: true, requiredVersion: '*'},
      /*# end #*/
      'query-string': {singleton: true, eager: true, requiredVersion: '*'},
      axios: {singleton: true, eager: true, requiredVersion: '*'},
      '<%= elux %>': {singleton: true, eager: true, requiredVersion: '*'},
    },
  },
};
