/* create-elux@^2.0.0 */

function replaceLess(code, css) {
  if (css === "sass") {
    return code
      .replace(/@(?!import|keyframes|media|\W)/g, "$")
      .replace(/(@import .*?['"].+?)\.less/g, "$1.scss")
      .replace(/(@import .*?['"])\$/g, "$1@");
  }
  return code;
}

function replaceTsx(code, css) {
  // code = code.replace(/\s+\/\*#\s+\[\[\[([+-]\d+)\s+#\*\/([\s\S]*?\n)\s*\/\*#\s+\]\]\]\s+#\*\/\s*\n/g, (a, cmd, str) => {
  //   const num = parseInt(cmd.substr(1));
  //   return str.replace(new RegExp(`\n[ ]{${num}}`, "g"), "\n");
  // });
  if (css === "sass") {
    return code.replace(/(import .*?['"].+?)\.less/g, "$1.scss");
  }
  return code;
}

function replaceMicroPackage(code, filepath, projectName) {
  const stageModule = `    "@${projectName}/stage": "^1.0.0"`;
  const articleModule = `    "@${projectName}/article": "^1.0.0"`;
  const shopModule = `    "@${projectName}/shop": "^1.0.0"`;
  const adminModule = `    "@${projectName}/admin": "^1.0.0"`;
  const myModule = `    "@${projectName}/my": "^1.0.0"`;
  const Depes = {
    "basic-team": [stageModule],
    "article-team": [stageModule, articleModule, shopModule],
    "user-team": [stageModule, adminModule, myModule],
    "app-build": [stageModule, articleModule, shopModule, adminModule, myModule],
    "app-runtime": [stageModule, articleModule, shopModule, adminModule, myModule],
  };
  const Publishs = {
    "basic-team": [stageModule],
    "article-team": [articleModule, shopModule],
    "user-team": [adminModule, myModule],
  };
  if (/\.\/[\w-]+\/package\.json/.test(filepath)) {
    const arr = filepath.split("/");
    const subProjectName = arr[arr.length - 2];
    const publishs = Publishs[subProjectName];
    if (publishs) {
      code = code.replace('    "dev": "elux webpack-dev",', '    "publish:lerna": "lerna publish",\n    "dev": "elux webpack-dev",');
    }
    code = code.replace(`name": "${projectName}`, `name": "${subProjectName}`);
    code = code.replace(/(workspaces": \[)[^\]]+(\])/, (_, $1, $2) => {
      return "__" + $1 + "\n    " + [publishs ? '"./src/modules/*"' : null].filter(Boolean).join(",\n    ") + "\n  " + $2;
    });
    const deps = Depes[subProjectName];
    if (deps) {
      return code.replace(
        '\n  },\n  "devDependencies": {',
        ",\n" + deps.join(",\n") + '\n  },\n  "devDependencies": {' + (publishs ? '\n    "lerna": "~3.22.1",' : "")
      );
    }
  } else if (filepath.endsWith("/public/package.json")) {
    const arr = filepath.split("/");
    const subProjectName = arr[arr.length - 3];
    return code.replace(`name": "${projectName}-demo`, `name": "${subProjectName}-demo`);
  }

  return code;
}

function onPlatformSelect(platform, options) {
  options.platform = platform;
  if (platform === "rn") {
    return;
  } else if (platform === "model") {
    return onFrameworkSelect("react", options);
  } else {
    return {
      subject: "请选择:UI框架",
      choices: ["react", "vue"],
      onSelect: onFrameworkSelect,
    };
  }
}
function onFrameworkSelect(framework, options) {
  options.framework = framework;
  return {
    subject: "请选择:CSS预处理器",
    choices: ["less", "sass"],
    onSelect: onCssSelect,
  };
}
function onCssSelect(css, options) {
  options.css = css;
  return {
    subject: "请选择:模版风格",
    choices:
      options.platform === "micro" || options.platform === "model" || options.platform === "taro"
        ? ["h5|H5手机风格"]
        : ["h5|H5手机风格", "admin|Admin后台风格"],
    onSelect: onStyleSelect,
  };
}
function onStyleSelect(style, options) {
  options.style = style;
  return {
    subject: "请选择:路由风格",
    choices: options.platform === "ssr" ? ["post|请求数据前置、路由跳转后置"] : ["pre|路由跳转前置、请求数据后置", "post|请求数据前置、路由跳转后置"],
    onSelect: onRouteSelect,
  };
}
function onRouteSelect(route, options) {
  options.route = route;
  return {
    subject: "请选择:构建工具",
    choices: ["webpack"],
    onSelect: onBuildSelect,
  };
}
function onBuildSelect(build, options) {
  options.build = build;
  options.elux = `@elux/${options.framework}-${options.platform === "rn" ? "rn" : options.platform === "taro" ? "taro" : "web"}`;
  return;
}

return {
  getOptions() {
    return {
      subject: "请选择:平台架构",
      choices: [
        "csr|CSR: 基于浏览器渲染的Web应用",
        "ssr|SSR: 基于服务器渲染 + 浏览器渲染的同构应用",
        "micro|Micro: 基于Webpack5的微前端 + 微模块方案",
        "model|Model: 基于模型驱动，React与Vue跨项目共用Model",
        "taro|Taro: 基于Taro的跨平台应用（各类小程序）",
        "rn|RN: 基于ReactNative的原生APP（开发中...）",
      ],
      onSelect: onPlatformSelect,
    };
  },
  getOperation(options) {
    if (options.platform === "rn") {
      return [{ action: "copy", from: "./common-rn", to: "$" }];
    } else if (options.platform === "model") {
      return [
        { action: "copy", from: "./common-web", to: "$/react-team" },
        { action: "move", from: "$/react-team/mock", to: "$/app-api" },
        { action: "copy", from: "./app-api", to: "$/app-api" },
        { action: "copy", from: "./common-web/.vscode", to: "$/app-api/.vscode" },
        { action: "copy", from: "$/react-team/src/components", to: "$/react-team/src/modules/stage/components" },
        { action: "copy", from: "$/react-team/src/assets", to: "$/react-team/src/modules/stage/assets" },
        { action: "copy", from: "$/react-team/src/utils", to: "$/react-team/src/modules/stage-model/utils" },
        { action: "move", from: "$/react-team/src/components", to: "" },
        { action: "move", from: "$/react-team/src/assets", to: "" },
        { action: "move", from: "$/react-team/src/utils", to: "" },
        { action: "copy", from: "$/react-team/", to: "$/vue-team" },
        { action: "move", from: "$/vue-team/src/modules/stage-model", to: "" },
        { action: "copy", from: "./common-model", to: "$" },
      ];
    } else if (options.platform === "micro") {
      return [
        { action: "copy", from: "./common-web", to: "$/article-team" },
        { action: "move", from: "$/article-team/mock", to: "$/app-api" },
        { action: "copy", from: "./app-api", to: "$/app-api" },
        { action: "copy", from: "./common-web/.vscode", to: "$/app-api/.vscode" },
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
        { action: "move", from: "$/basic-team/src/modules/admin", to: "" },
        { action: "move", from: "$/basic-team/src/modules/shop", to: "" },
        { action: "move", from: "$/article-team/src/modules/stage", to: "" },
        { action: "move", from: "$/article-team/src/modules/my", to: "" },
        { action: "move", from: "$/article-team/src/modules/admin", to: "" },
        { action: "move", from: "$/user-team/src/modules/stage", to: "" },
        { action: "move", from: "$/user-team/src/modules/article", to: "" },
        { action: "move", from: "$/user-team/src/modules/shop", to: "" },
        { action: "move", from: "$/app-build/src/modules", to: "" },
        { action: "move", from: "$/app-runtime/src/modules", to: "" },
        { action: "copy", from: "./common-micro", to: "$" },
      ];
    } else if (options.platform === "taro") {
      return [
        { action: "copy", from: "./common-web", to: "$" },
        { action: "copy", from: "./common-taro", to: "$" },
        { action: "move", from: "$/env", to: "" },
        { action: "move", from: "$/public", to: "" },
        { action: "move", from: "$/src/components/TabBar", to: "" },
        { action: "move", from: "$/src/index.ts", to: "" },
      ];
    } else if (options.style === "admin") {
      return [
        { action: "copy", from: "./common-web", to: "$" },
        { action: "copy", from: "./common-admin", to: "$" },
      ];
    } else {
      return [{ action: "copy", from: "./common-web", to: "$" }];
    }
  },
  getNpmLockFile(options) {
    const { platform, framework, css } = options;
    if(platform === "model"){
      return 'model-web-lock';
    }
    const arr = [];
    if (platform === "csr" || platform === "ssr") {
      arr.push("web");
    } else {
      arr.push(platform);
    }
    arr.push(framework, "lock");
    return arr.join("-");
  },
  rename(options, filepath) {
    if (options.css === "sass" && filepath.endsWith(".less")) {
      return filepath.replace(/.less$/, ".scss");
    }
    if (options.platform !== "ssr" && filepath.endsWith("/src/server.ts")) {
      return "";
    }
    if (options.platform === "micro") {
      if (
        filepath.endsWith("/article-team/src/Project.ts") ||
        filepath.endsWith("/user-team/src/Project.ts") ||
        filepath.endsWith("/basic-team/src/Project.ts")
      ) {
        return "";
      }
      if (filepath.endsWith("/src/.babelrc.js")) {
        return filepath.replace("/src/.babelrc.js", "/babel.config.js");
      }
    } else if (options.platform === "model") {
      const isVueTeam = filepath.indexOf("/vue-team/") > -1;
      if (filepath.endsWith("/src/.babelrc.js")) {
        return filepath.replace("/src/.babelrc.js", "/babel.config.js");
      }
      if (filepath.endsWith("/model.ts")) {
        return isVueTeam ? "" : filepath.replace("/model.ts", "-model/model.ts");
      }
      if (filepath.endsWith("/api.ts")) {
        return isVueTeam ? "" : filepath.replace("/api.ts", "-model/api.ts");
      }
      if (filepath.endsWith("/entity.ts")) {
        return isVueTeam ? "" : filepath.replace("/entity.ts", "-model/entity.ts");
      }
    } else {
      if (/\/modules\/\w+\/package\.json/.test(filepath)) {
        return "";
      }
    }
    if (options.platform === "taro") {
      if (filepath.endsWith("elux.config.js") || filepath.endsWith("postcss.config.js") || filepath.endsWith("/src/.babelrc.js")) {
        return "";
      }
    }
    return filepath;
  },
  beforeRender(options, filepath, code) {
    const valueKeys = {
      react: "framework",
      vue: "framework",
      less: "css",
      sass: "css",
      csr: "platform",
      ssr: "platform",
      micro: "platform",
      model: "platform",
      taro: "platform",
      pre: "route",
      post: "route",
      admin: "style",
      h5: "style",
    };
    if (options.platform === "model") {
      if (!options._projectName) {
        options._projectName = options.projectName;
      }
      if (filepath.indexOf("vue-team/") > -1) {
        options.framework = "vue";
        options.elux = "@elux/vue-web";
        options.projectName = "vue-team";
      } else if (filepath.indexOf("react-team/") > -1) {
        options.framework = "react";
        options.elux = "@elux/react-web";
        options.projectName = "react-team";
      } else if (filepath.indexOf("app-api/") > -1) {
        options.projectName = "app-api";
      } else {
        options.projectName = options._projectName;
      }
      if (filepath.indexOf("-model/") > -1 || filepath.endsWith("/model.ts") || filepath.endsWith("/api.ts") || filepath.endsWith("/entity.ts")) {
        options.elux = "@elux/model";
        console.log(filepath);
      }
    }
    return code
      .replace(
        /\/\*#\s+\=(!?)(react|vue|ssr|csr|micro|model|taro|less|sass|post|pre|admin|h5)\?([^:]+?):(.*?)\s+#\*\//g,
        (str, v1, v2, v3, v4) => `<%= ${valueKeys[v2]}${v1 || "="}=='${v2}'?\`${v3}\`:\`${v4}\` %>`
      )
      .replace(
        /\/\*#\s+if:(!?)(react|vue|ssr|csr|micro|model|taro|less|sass|post|pre|admin|h5)\s+#\*\//g,
        (str, v1, v2) => `<%_ if(${valueKeys[v2]}${v1 || "="}=='${v2}'){ -%>`
      )
      .replace(
        /\/\*#\s+else:(!?)(react|vue|ssr|csr|micro|model|taro|less|sass|post|pre|admin|h5)\s+#\*\//g,
        (str, v1, v2) => `<%_ }else if(${valueKeys[v2]}${v1 || "="}=='${v2}'){ -%>`
      )
      .replace(/\/\*#\s+else\s+#\*\//g, `<%_ }else{ -%>`)
      .replace(/\/\*#\s+end\s+#\*\//g, `<%_ } -%>`);
  },
  afterRender(options, filepath, code) {
    if (options.platform === "micro") {
      if (filepath.endsWith(".tsx") || filepath.endsWith(".ts") || filepath.endsWith(".less")) {
        code = code.replace(/(['"])@\/(components|utils|assets)\//g, (v, v1, v2) => {
          if (filepath.indexOf("/modules/stage/") > -1) {
            const arr = filepath
              .split("/modules/stage/")[1]
              .split("/")
              .map(() => "..");
            arr.shift();
            return `${v1}${arr[0] ? arr.join("/") : "."}/${v2}/`;
          } else {
            return `${v1}@${options.projectName}/stage/${v2}/`;
          }
        });
        code = code.replace(/(['"])@\/modules\//g, `$1@${options.projectName}/`);
      }
      if (filepath.endsWith("package.json")) {
        return replaceMicroPackage(code, filepath, options.projectName);
      }
    } else if (options.platform === "model") {
      if (filepath.endsWith(".tsx") || filepath.endsWith(".ts") || filepath.endsWith(".less")) {
        code = code.replace(/(['"])@\/(components|utils|assets)\//g, (v, v1, v2) => {
          if (filepath.indexOf("/modules/stage/") > -1) {
            const arr = filepath
              .split("/modules/stage/")[1]
              .split("/")
              .map(() => "..");
            arr.shift();
            return `${v1}${arr[0] ? arr.join("/") : "."}/${v2}/`;
          } else {
            return `${v1}@${options.projectName}/stage/${v2}/`;
          }
        });
        code = code.replace(/(['"])@\/modules\//g, `$1@${options.projectName}/`);
        code = code.replace(/@[\w-]+\/stage\/utils\//g, `@react-team/stage-model/utils/`);
        code = code.replace(/@[\w-]+\/([\w-]+)(?=\/entity)/g, `@react-team/$1-model`);
        if (filepath.indexOf("model.ts") < 0 && filepath.indexOf("api.ts") < 0) {
          code = code.replace(/from (['"])[./]+?\/(model|entity)/g, (str, v1, v2) => {
            const moduleName = filepath.split("/src/modules/")[1].split("/")[0];
            return `from ${v1}@react-team/${moduleName}-model/${v2}`;
          });
        }
      }
    }
    if (filepath.endsWith(".tsx")) {
      return replaceTsx(code, options.css);
    }
    if (filepath.endsWith(".less")) {
      return replaceLess(code, options.css);
    }
    return code;
  },
  shouldEslint(options) {
    return true;
  },
};
