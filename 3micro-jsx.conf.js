let Alias, Depes;
module.exports = {
  platform: ["micro"],
  framework: ["reactRedux", "vueVuex"],
  css: ["less", "sass"],
  install: ["./", "./mock", "./basic-team", "./article-team", "./user-team"],
  getTitle(options) {
    return options.framework === "reactRedux" ? "web-react-redux" : "web-vue3-vuex（使用JSX）";
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
    const stageDeps = `    "@${projectName}/stage": "../basic-team/src/modules/stage"`;
    const articleDeps = `    "@${projectName}/article": "../article-team/src/modules/article"`;
    const myDeps = `    "@${projectName}/my": "../user-team/src/modules/my"`;
    Depes = {
      "basic-team": [stageDeps],
      "article-team": [stageDeps, articleDeps],
      "user-team": [stageDeps, myDeps],
      "app-api": [stageDeps, articleDeps, myDeps],
      "app-build": [stageDeps, articleDeps, myDeps],
      "app-runtime": [stageDeps, articleDeps, myDeps],
    };
    return {
      ...options,
      css: options.css === "less" ? "less" : "scss",
      elux: options.framework === "reactRedux" ? "react-redux-web" : "vue-vuex-web",
      render: "jsx",
    };
  },
  operation: [
    { action: "copy", from: "./common-web", to: "$/article-team" },
    { action: "move", from: "$/article-team/mock", to: "$/app-api" },
    { action: "copy", from: "$/article-team/src/components", to: "$/article-team/src/modules/stage/components" },
    { action: "copy", from: "$/article-team/src/assets", to: "$/article-team/src/modules/stage/assets" },
    { action: "copy", from: "$/article-team/src/utils", to: "$/article-team/src/modules/stage/utils" },
    { action: "move", from: "$/article-team/src/components", to: "" },
    { action: "move", from: "$/article-team/src/assets", to: "" },
    { action: "move", from: "$/article-team/src/utils", to: "" },
    { action: "copy", from: "$/article-team/", to: "$/basic-team" },
    { action: "copy", from: "$/article-team/", to: "$/user-team" },
    { action: "copy", from: "$/article-team/", to: "$/app-build" },
    { action: "copy", from: "$/article-team/", to: "$/app-runtime" },
    { action: "move", from: "$/basic-team/src/modules/article", to: "" },
    { action: "move", from: "$/basic-team/src/modules/my", to: "" },
    { action: "move", from: "$/article-team/src/modules/stage", to: "" },
    { action: "move", from: "$/article-team/src/modules/my", to: "" },
    { action: "move", from: "$/user-team/src/modules/stage", to: "" },
    { action: "move", from: "$/user-team/src/modules/article", to: "" },
    { action: "move", from: "$/app-build/src/modules", to: "" },
    { action: "move", from: "$/app-runtime/src/modules", to: "" },
    { action: "copy", from: "./common-micro", to: "$" },
  ],
  rename(data, filepath) {
    if (filepath.endsWith("/src/server.ts")) {
      return "";
    }
    if (data.css === "scss" && filepath.endsWith(".less")) {
      return filepath.replace(/.less$/, ".scss");
    }
    if (filepath.endsWith("/src/.babelrc.js")) {
      return filepath.replace("/src/.babelrc.js", "/babel.config.js");
    }
    return filepath;
  },
  afterRender(data, filepath, code) {
    if (filepath.endsWith(".tsx") || filepath.endsWith(".ts") || filepath.endsWith(".less")) {
      code = code.replace(/(['"])@\/(components|utils|assets)\//g, `$1@${data.projectName}/stage/$2/`);
      code = code.replace(/(['"])@\/modules\//g, `$1@${data.projectName}/`);
    }
    if (filepath.endsWith(".tsx")) {
      return replaceTsx(code, data.css);
    }
    if (filepath.endsWith(".less")) {
      return replaceLess(code, data.css);
    }
    if (filepath.endsWith("model.ts")) {
      return replaceModel(code, data.framework);
    }
    if (filepath.endsWith("tsconfig.json")) {
      return replaceTsconfig(code, filepath);
    }
    if (filepath.endsWith("package.json")) {
      return replacePackage(code, filepath, data.projectName);
    }
    return code;
  },
};

function replaceLess(code, css) {
  if (css === "scss") {
    return code.replace(/@(?!import|keyframes|media|\W)/g, "$").replace(/(import .*?['"].+?)\.less/g, "$1.scss");
  }
  return code;
}

function replaceTsx(code, css) {
  //jsx import 组件不需要加扩展名
  code = code.replace(/\.vue';/g, "';");
  if (css === "scss") {
    return code.replace(/(import .*?['"].+?)\.less/g, "$1.scss");
  }
  return code;
}

function replaceModel(code, framework) {
  if (framework === "vueVuex") {
    return code
      .replace(/\breducer\b(?=.*\} from)/g, "mutation")
      .replace(/\beffect\b(?=.*\} from)/g, "action")
      .replace(/\):\s*ModuleState\s*{/g, "): void {")
      .replace(/@reducer/g, "@mutation")
      .replace(/@effect/g, "@action");
  }
  return code;
}

function replacePackage(code, filepath, projectName) {
  if (/\.\/[\w-]+\/package\.json/.test(filepath)) {
    const arr = filepath.split("/");
    const subProjectName = arr[arr.length - 2];
    const deps = Depes[subProjectName];
    code = code.replace(`name": "${projectName}`, `name": "@${projectName}/${subProjectName}`);
    code = code.replace(/  "workspaces": \[[^\]]+\],\n/, "");
    if (deps) {
      return code.replace('\n  },\n  "devDependencies": {', ",\n" + deps.join(",\n") + '\n  },\n  "devDependencies": {');
    }
  } else if (filepath.endsWith("/public/package.json")) {
    const arr = filepath.split("/");
    const subProjectName = arr[arr.length - 3];
    return code.replace('"name": "demo"', `"name": "${subProjectName}-demo"`);
  }

  return code;
}

function replaceTsconfig(code, filepath) {
  const arr = filepath.split("/");
  const subProjectName = arr[arr.length - 3];
  const paths = Alias[subProjectName];
  if (paths) {
    return code.replace('"@/*": ["./*"]', paths.join(",\n      "));
  }
  return code;
}
