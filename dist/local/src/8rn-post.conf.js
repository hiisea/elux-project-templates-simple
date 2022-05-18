return {
  platform: ["rn"],
  framework: ["react"],
  css: ["less", "sass"],
  getTitle(options) {
    return getTitle(options, "post");
  },
  data(options) {
    return getData(options, "post");
  },
  operation,
  getNpmLockFile,
  rename,
  beforeRender,
  afterRender,
};
