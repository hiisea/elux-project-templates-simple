return {
  platform: ["micro"],
  framework: ["react", "vue"],
  css: ["less", "sass"],
  getTitle(options) {
    return getTitle(options, "post");
  },
  data(options) {
    const projectName = options.projectName;
    Alias = {
      "basic-team": [`"@/Global": ["./Global"]`, `"@${projectName}/stage": ["./modules/stage"]`, `"@${projectName}/stage/*": ["./modules/stage/*"]`],
      "article-team": [
        `"@/Global": ["./Global"]`,
        `"@${projectName}/article": ["./modules/article"]`,
        `"@${projectName}/article/*": ["./modules/article/*"]`,
      ],
      "user-team": [`"@/Global": ["./Global"]`, `"@${projectName}/my": ["./modules/my"]`, `"@${projectName}/my/*": ["./modules/my/*"]`],
    };
    const stageModule = `    "@${projectName}/stage": "^1.0.0"`;
    const articleModule = `    "@${projectName}/article": "^1.0.0"`;
    const myModule = `    "@${projectName}/my": "^1.0.0"`;
    Depes = {
      "basic-team": [stageModule],
      "article-team": [stageModule, articleModule],
      "user-team": [stageModule, myModule],
      "app-api": [stageModule, articleModule, myModule],
      "app-build": [stageModule, articleModule, myModule],
      "app-runtime": [stageModule, articleModule, myModule],
    };
    Publishs = {
      "basic-team": [stageModule],
      "article-team": [articleModule],
      "user-team": [myModule],
    };
    return getData(options, "post");
  },
  operation,
  getNpmLockFile,
  rename,
  beforeRender,
  afterRender,
};
