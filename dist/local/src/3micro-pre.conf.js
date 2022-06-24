return {
  platform: ["micro"],
  framework: ["react", "vue"],
  css: ["less", "sass"],
  getTitle(options) {
    return getTitle(options, "pre");
  },
  data(options) {
    const projectName = options.projectName;
    const stageModule = `    "@${projectName}/stage": "^1.0.0"`;
    const articleModule = `    "@${projectName}/article": "^1.0.0"`;
    const shopModule = `    "@${projectName}/shop": "^1.0.0"`;
    const adminModule = `    "@${projectName}/admin": "^1.0.0"`;
    const myModule = `    "@${projectName}/my": "^1.0.0"`;
    Depes = {
      "basic-team": [stageModule],
      "article-team": [stageModule, articleModule, shopModule],
      "user-team": [stageModule, adminModule, myModule],
      "app-api": [stageModule, articleModule, shopModule, adminModule, myModule],
      "app-build": [stageModule, articleModule, shopModule, adminModule, myModule],
      "app-runtime": [stageModule, articleModule, shopModule, adminModule, myModule],
    };
    Publishs = {
      "basic-team": [stageModule],
      "article-team": [articleModule, shopModule],
      "user-team": [adminModule, myModule],
    };
    return getData(options, "pre");
  },
  operation,
  getNpmLockFile,
  rename,
  beforeRender,
  afterRender,
};
