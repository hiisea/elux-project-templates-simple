return {
  platform: ["csr"],
  framework: ["react", "vue"],
  css: ["less", "sass"],
  getTitle(options) {
    return getTitle(options, "pre");
  },
  data(options) {
    return getData(options, "pre");
  },
  operation: getOperation(),
  getNpmLockFile,
  rename,
  beforeRender,
  afterRender,
};
