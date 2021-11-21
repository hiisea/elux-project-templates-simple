module.exports = {
  title: 'web-react-redux',
  platform: ['csr', 'ssr'],
  framework: ['reactRedux'],
  css: ['less', 'scss'],
  data: (options) => {
    return {...options, elux: 'react-redux-web'};
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
