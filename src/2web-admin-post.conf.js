return {
  platform: ["csr", "ssr"],
  framework: ["react", "vue"],
  css: ["less", "sass"],
  getTitle(options) {
    return getTitle(options, "post", "admin");
  },
  data(options) {
    return getData(options, "post", "admin");
  },
  operation(options) {
    return operation(options, 'admin')
  },
  getNpmLockFile,
  rename,
  beforeRender,
  afterRender,
};
