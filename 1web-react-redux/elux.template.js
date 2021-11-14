module.exports = {
  title: 'web-react-redux 默认示例',
  platform: ['csr', 'ssr'],
  framework: ['reactRedux'],
  css: ['less', 'scss'],
  data: (options) => {
    const {framework} = options;
    const elux = framework ==='reactRedux' ? 'react-redux-web' : 'vue-vuex-web';
    return {...options, elux}
  },
  include: ['../common-web'],
  rename: {
    '*'(options, filepath) {
      if(filepath.endsWith('.less')){
        return filepath.replace(/.less$/, '.' + options.css);
      }
      return filepath;
    },
    './src/server.ts'(options) {
      if (options.platform === 'csr') {
        return '';
      }
      return './src/server.ts';
    },
  },
};
