return {
  platform: ["csr", "ssr"],
  framework: ["react", "vue"],
  css: ["less", "sass"],
  getTitle(options) {
    return getTitle(options, "post");
  },
  data(options) {
    return getData(options, "post");
  },
  operation: getOperation(),
  getNpmLockFile,
  rename,
  beforeRender,
  afterRender,
};
