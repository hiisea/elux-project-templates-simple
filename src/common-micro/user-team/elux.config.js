//工程配置文件，参见 https://eluxjs.com/guide/configure.html
const {getLocalIP} = require('@elux/cli-utils');
const apiHost = `http://${getLocalIP()}:3003/`;
module.exports = {
  type: '<%= framework %>',
  mockServer: {port: 3003, dir: '../app-api'},
  cssProcessors: {/*# =less?less:sass #*/: true},
  all: {
    //开发和生成环境都使用的配置
    serverPort: 4002,
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
    name: 'userTeam',
    filename: 'remote.js',
    exposes: {
      './modules/admin': './src/modules/admin',
      './modules/my': './src/modules/my',
    },
    shared: {
      /*# if:react #*/
      react: {singleton: true, eager: true, requiredVersion: '*'},
      'react-dom': {singleton: true, eager: true, requiredVersion: '*'},
      /*# else:vue #*/
      vue: {singleton: true, eager: true, requiredVersion: '*'},
      /*# end #*/
      'query-string': {singleton: true, eager: true, requiredVersion: '*'},
      'path-to-regexp': {singleton: true, eager: true, requiredVersion: '*'},
      axios: {singleton: true, eager: true, requiredVersion: '*'},
      '<%= elux %>': {singleton: true, eager: true, requiredVersion: '*'},
    },
  },
};
