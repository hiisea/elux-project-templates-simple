module.exports = {
  title: 'web-vue3-vuex（使用jsx）',
  platform: ['csr', 'ssr'],
  framework: ['vueVuex'],
  css: ['less', 'scss'],
  data: (options) => {
    return {...options, elux: 'vue-vuex-web'};
  },
  include: ['../common-web'],
  rename: {
    '*'(options, filepath) {
      if (filepath.endsWith('.less')) {
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
