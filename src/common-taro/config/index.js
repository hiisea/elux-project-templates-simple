const path = require('path');
const {getLocalIP, getCssScopedName} = require('@elux/cli-utils');

const srcPath = path.resolve(__dirname, '..', 'src');

const config = {
  projectName: '<%= projectName %>',
  date: '2022-5-1',
  designWidth: 640,
  deviceRatio: {
    640: 3.5 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  alias: {
    '@': srcPath,
  },
  plugins: ['@tarojs/plugin-html'],
  defineConstants: {
    'process.env.PROJ_ENV': JSON.stringify({
      ApiPrefix: `http://${getLocalIP()}:3003/`,
      StaticPrefix: `http://${getLocalIP()}:3003/`,
    }),
  },
  copy: {
    patterns: [],
    options: {},
  },
  framework: '/*# =vue?vue3:react #*/',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024 * 8, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: true,
        config: {
          namingPattern: 'module',
          generateScopedName(localName, mfileName) {
            return getCssScopedName(srcPath, localName, mfileName);
          },
          localIdentContext: srcPath,
        },
      },
    },
  },
  h5: {
    router: {
      mode: 'browser',
    },
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: false,
        config: {},
      },
      cssModules: {
        enable: true,
        config: {
          namingPattern: 'module',
          generateScopedName(localName, mfileName) {
            return getCssScopedName(srcPath, localName, mfileName);
          },
          localIdentContext: srcPath,
        },
      },
    },
  },
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
