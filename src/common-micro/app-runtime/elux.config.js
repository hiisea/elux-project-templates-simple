//工程配置文件，参见 https://eluxjs.com/guide/configure.html
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
  moduleFederation: {
    name: 'app-runtime',
    modules: {
      '@<%= projectName %>/article': '@article-team/modules/article',
      '@<%= projectName %>/shop': '@article-team/modules/shop',
      '@<%= projectName %>/admin': '@user-team/modules/admin',
      '@<%= projectName %>/my': '@user-team/modules/my',
    },
    remotes: {
      '@article-team': 'articleTeam@http://localhost:4001/client/remote.js',
      '@user-team': 'userTeam@http://localhost:4002/client/remote.js',
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
