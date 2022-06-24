/* create-elux@^1.0.0 */

function replaceLess(code, css) {
  if (css === "sass") {
    return code
      .replace(/@(?!import|keyframes|media|\W)/g, "$")
      .replace(/(@import .*?['"].+?)\.less/g, "$1.scss")
      .replace(/(@import .*?['"])\$/g, "$1@");
  }
  return code;
}

// function replaceTaroCss(code, css) {
//   return code.replace(/> \*/g, "> .h5-div").replace(/> :/g, "> .h5-div:");
// }

function replaceTsx(code, css) {
  code = code.replace(/\s+\/\*#\s+\[\[\[([+-]\d+)\s+#\*\/([\s\S]*?\n)\s*\/\*#\s+\]\]\]\s+#\*\/\s*\n/g, (a, cmd, str) => {
    const num = parseInt(cmd.substr(1));
    return str.replace(new RegExp(`\n[ ]{${num}}`, "g"), "\n");
  });

  if (css === "sass") {
    return code.replace(/(import .*?['"].+?)\.less/g, "$1.scss");
  }
  return code;
}

function replacePackage(code, filepath, projectName) {
  const stageModule = `    "@${projectName}/stage": "^1.0.0"`;
  const articleModule = `    "@${projectName}/article": "^1.0.0"`;
  const shopModule = `    "@${projectName}/shop": "^1.0.0"`;
  const adminModule = `    "@${projectName}/admin": "^1.0.0"`;
  const myModule = `    "@${projectName}/my": "^1.0.0"`;
  const Depes = {
    "basic-team": [stageModule],
    "article-team": [stageModule, articleModule, shopModule],
    "user-team": [stageModule, adminModule, myModule],
    "app-api": [stageModule, articleModule, shopModule, adminModule, myModule],
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
    code = code.replace(`name": "${projectName}`, `name": "@${projectName}/${subProjectName}`);
    code = code.replace(/(workspaces": \[)[^\]]+(\])/, (_, $1, $2) => {
      return "__" + $1 + "\n    " + ['"./public"', publishs ? '"./src/modules/*"' : null].filter(Boolean).join(",\n    ") + "\n  " + $2;
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
    return code.replace(`name": "@${projectName}/demo`, `name": "@${projectName}/${subProjectName}-demo`);
  }

  return code;
}

function onPlatformSelect(platform, options) {
  options.platform = platform;
  if (platform === "rn") {
    return;
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
    choices: options.platform === "micro" || options.platform === "taro" ? ["h5|H5手机风格"] : ["admin|Admin后台风格", "h5|H5手机风格"],
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
        "csr|CSR: 基于浏览器渲染的应用",
        "ssr|SSR: 基于服务器渲染 + 浏览器渲染的同构应用",
        "micro|Micro: 基于Webpack5的微前端 + 微模块方案",
        "taro|Taro: 基于Taro的跨平台应用（各类小程序）",
        "rn|RN: 基于ReactNative的原生APP（开发中...）",
      ],
      onSelect: onPlatformSelect,
    };
  },
  getOperation(options) {
    if (options.platform === "rn") {
      return [{ action: "copy", from: "./common-rn", to: "$" }];
    } else if (options.platform === "micro") {
      return [
        { action: "copy", from: "./common-web/.vscode", to: "$/.vscode" },
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
      taro: "platform",
      pre: "route",
      post: "route",
      admin: "style",
      h5: "style",
    };
    return code
      .replace(
        /\/\*#\s+\=(!?)(react|vue|ssr|csr|micro|taro|less|sass|post|pre|admin|h5)\?([^:]+?):(.*?)\s+#\*\//g,
        (str, v1, v2, v3, v4) => `<%= ${valueKeys[v2]}${v1 || "="}=='${v2}'?\`${v3}\`:\`${v4}\` %>`
      )
      .replace(
        /\/\*#\s+if:(!?)(react|vue|ssr|csr|micro|taro|less|sass|post|pre|admin|h5)\s+#\*\//g,
        (str, v1, v2) => `<%_ if(${valueKeys[v2]}${v1 || "="}=='${v2}'){ -%>`
      )
      .replace(
        /\/\*#\s+else:(!?)(react|vue|ssr|csr|micro|taro|less|sass|post|pre|admin|h5)\s+#\*\//g,
        (str, v1, v2) => `<%_ }else if(${valueKeys[v2]}${v1 || "="}=='${v2}'){ -%>`
      )
      .replace(/\/\*#\s+else\s+#\*\//g, `<%_ }else{ -%>`)
      .replace(/\/\*#\s+end\s+#\*\//g, `<%_ } -%>`);
  },
  afterRender(options, filepath, code) {
    if (options.platform === "micro") {
      if (filepath.endsWith(".tsx") || filepath.endsWith(".ts") || filepath.endsWith(".less")) {
        code = code.replace(/(['"])@\/(components|utils|assets)\//g, `$1@${options.projectName}/stage/$2/`);
        code = code.replace(/(['"])@\/modules\//g, `$1@${options.projectName}/`);
      }
      if (filepath.endsWith("package.json")) {
        return replacePackage(code, filepath, options.projectName);
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
};
