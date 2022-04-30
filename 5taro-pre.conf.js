return {
  platform: ["taro"],
  framework: ["react", "vue"],
  css: ["less", "sass"],
  getTitle(options) {
    return getTitle(options, "pre");
  },
  data(options) {
    return getData(options, "pre");
  },
  operation,
  getNpmLockFile,
  rename,
  beforeRender,
  afterRender,
};
