/* ^2.0.0 */
let Alias, Publishs, Depes;

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

function getTitle(options, route, style) {
  const routeSubject = route === "pre" ? "路由前置" : "路由后置";
  const platform = options.platform === "rn" ? "开发中" : options.platform === "Taro" ? "Taro" : style === "admin" ? "Admin" : "H5";
  const ui = options.framework === "react" ? "react" : "vue3";
  return `${platform}-${ui}（${routeSubject}）`;
}

function getData(options, route, style) {
  const platform = options.platform === "rn" ? "rn" : options.platform === "taro" ? "taro" : "web";
  const ui = options.framework;
  return {
    ...options,
    elux: `@elux/${ui}-${platform}`,
    route,
    style,
  };
}

function getNpmLockFile(options) {
  const { platform, framework, css } = options;
  const arr = [];
  if (platform === "csr" || platform === "ssr") {
    arr.push("web");
  } else {
    arr.push(platform);
  }
  arr.push(framework, "lock");
  return arr.join("-");
}

function operation(options, style) {
  console.log(3333, style);
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
  } else if (style === "admin") {
    return [
      { action: "copy", from: "./common-web", to: "$" },
      { action: "copy", from: "./common-admin", to: "$" },
    ];
  } else {
    return [{ action: "copy", from: "./common-web", to: "$" }];
  }
}

function beforeRender(data, filepath, code) {
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
}

function afterRender(data, filepath, code) {
  if (data.platform === "micro") {
    if (filepath.endsWith(".tsx") || filepath.endsWith(".ts") || filepath.endsWith(".less")) {
      code = code.replace(/(['"])@\/(components|utils|assets)\//g, `$1@${data.projectName}/stage/$2/`);
      code = code.replace(/(['"])@\/modules\//g, `$1@${data.projectName}/`);
    }
    if (filepath.endsWith("package.json")) {
      return replacePackage(code, filepath, data.projectName);
    }
  } else if (data.platform === "taro") {
    // if (filepath.endsWith(".less")) {
    //   code = replaceTaroCss(code, data.css);
    // }
  }
  if (filepath.endsWith(".tsx")) {
    return replaceTsx(code, data.css);
  }
  if (filepath.endsWith(".less")) {
    return replaceLess(code, data.css);
  }
  return code;
}

function rename(data, filepath) {
  if (data.css === "sass" && filepath.endsWith(".less")) {
    return filepath.replace(/.less$/, ".scss");
  }
  if (data.platform !== "ssr" && filepath.endsWith("/src/server.ts")) {
    return "";
  }
  if (data.platform === "micro") {
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
  if (data.platform === "taro") {
    if (filepath.endsWith("elux.config.js") || filepath.endsWith("postcss.config.js") || filepath.endsWith("/src/.babelrc.js")) {
      return "";
    }
  }
  return filepath;
}
