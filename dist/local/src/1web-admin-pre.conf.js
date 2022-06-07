return {
  platform: ["csr"],
  framework: ["react", "vue"],
  css: ["less", "sass"],
  getTitle(options) {
    return getTitle(options, "pre", "admin");
  },
  data(options) {
    return getData(options, "pre", "admin");
  },
  operation(options) {
    return operation(options, 'admin')
  },
  getNpmLockFile,
  rename,
  beforeRender,
  afterRender,
};
