return {
  platform: ["micro"],
  framework: ["react", "vue"],
  css: ["less", "sass"],
  getTitle(options) {
    return getTitle(options, "pre");
  },
  data(options) {
    const projectName = options.projectName;
    Alias = {
      "basic-team": [`"@/Global": ["./Global"]`, `"@${projectName}/stage": ["./modules/stage"]`, `"@${projectName}/stage/*": ["./modules/stage/*"]`],
      "article-team": [
        `"@/Global": ["./Global"]`,
        `"@${projectName}/article": ["./modules/article"]`,
        `"@${projectName}/article/*": ["./modules/article/*"]`,
        `"@${projectName}/shop": ["./modules/shop"]`,
        `"@${projectName}/shop/*": ["./modules/shop/*"]`,
      ],
      "user-team": [
        `"@/Global": ["./Global"]`,
        `"@${projectName}/admin": ["./modules/admin"]`,
        `"@${projectName}/admin/*": ["./modules/admin/*"]`,
        `"@${projectName}/my": ["./modules/my"]`,
        `"@${projectName}/my/*": ["./modules/my/*"]`,
      ],
    };
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
