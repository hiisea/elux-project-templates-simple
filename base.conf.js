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

function replaceTsx(code, css) {
  code = code.replace(/\s+\/\*#\s+\[\[\[([+-]\d+)\s+#\*\/([\s\S]*?)\/\*#\s+\]\]\]\s+#\*\/\s+/g, (a, cmd, str) => {
    return str.replace(/\n[ ]{4}/g, "\n");
  });

  if (css === "sass") {
    return code.replace(/(import .*?['"].+?)\.less/g, "$1.scss");
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

function replacePackage(code, filepath, projectName) {
  if (/\.\/[\w-]+\/package\.json/.test(filepath)) {
    const arr = filepath.split("/");
    const subProjectName = arr[arr.length - 2];
    const publishs = Publishs[subProjectName];
    if (publishs) {
      code = code.replace('    "dev": "elux dev",', '    "publish:lerna": "lerna publish",\n    "dev": "elux dev",');
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

function getTitle(options, route) {
  const routeSubject = route === "pre" ? "路由前置" : "路由后置";
  return options.framework === "react" ? `web-react（${routeSubject}）` : `web-vue3（${routeSubject}）`;
}

function getData(options, route) {
  return {
    ...options,
    elux: options.framework === "react" ? "@elux/react-web" : "@elux/vue-web",
    route,
  };
}

function getNpmLockFile(options) {
  const { platform, framework, css } = options;
  const fileName = [platform, framework, css].join("-");
  return `https://gitee.com/hiisea/elux-project-templates-simple/raw/v2/${fileName}-lock.zip`;
}

function getOperation(platform) {
  if (platform === "micro") {
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
      { action: "move", from: "$/article-team/src/modules/stage", to: "" },
      { action: "move", from: "$/article-team/src/modules/my", to: "" },
      { action: "move", from: "$/user-team/src/modules/stage", to: "" },
      { action: "move", from: "$/user-team/src/modules/article", to: "" },
      { action: "move", from: "$/app-build/src/modules", to: "" },
      { action: "move", from: "$/app-runtime/src/modules", to: "" },
      { action: "copy", from: "./common-micro", to: "$" },
    ];
  } else {
    return [{ action: "copy", from: "./common-web", to: "./$" }];
  }
}

function beforeRender(data, filepath, code) {
  return code
    .replace(
      /\/\*#\s+\=(react|vue|ssr|csr|micro|taro|less|sass|post|pre)\?([^:]+?):(.*?)\s+#\*\//g,
      (str, $1, $2, $3) => `<%= ${valueKeys[$1]}==='${$1}'?\`${$2}\`:\`${$3}\` %>`
    )
    .replace(/\/\*#\s+if:(react|vue|ssr|csr|micro|taro|less|sass|post|pre)\s+#\*\//g, (str, $1) => `<%_ if(${valueKeys[$1]}==='${$1}'){ -%>`)
    .replace(/\/\*#\s+else:(react|vue|ssr|csr|micro|taro|less|sass|post|pre)\s+#\*\//g, (str, $1) => `<%_ }else if(${valueKeys[$1]}==='${$1}'){ -%>`)
    .replace(/\/\*#\s+else\s+#\*\//g, `<%_ }else{ -%>`)
    .replace(/\/\*#\s+end\s+#\*\//g, `<%_ } -%>`);
}

function afterRender(data, filepath, code) {
  if (data.platform === "micro") {
    if (filepath.endsWith(".tsx") || filepath.endsWith(".ts") || filepath.endsWith(".less")) {
      code = code.replace(/(['"])@\/(components|utils|assets)\//g, `$1@${data.projectName}/stage/$2/`);
      code = code.replace(/(['"])@\/modules\//g, `$1@${data.projectName}/`);
    }
    if (filepath.endsWith("tsconfig.json")) {
      return replaceTsconfig(code, filepath);
    }
    if (filepath.endsWith("package.json")) {
      return replacePackage(code, filepath, data.projectName);
    }
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
  if (data.platform !== "ssr" && filepath.endsWith("/src/server.ts")) {
    return "";
  }
  if (
    data.platform === "micro" &&
    (filepath.endsWith("/article-team/src/Project.ts") ||
      filepath.endsWith("/user-team/src/Project.ts") ||
      filepath.endsWith("/basic-team/src/Project.ts"))
  ) {
    return "";
  }
  if (data.platform === "micro" && filepath.endsWith("/src/.babelrc.js")) {
    return filepath.replace("/src/.babelrc.js", "/babel.config.js");
  }
  if (data.platform !== "micro" && /\/modules\/\w+\/package\.json/.test(filepath)) {
    return "";
  }
  if (data.css === "sass" && filepath.endsWith(".less")) {
    return filepath.replace(/.less$/, ".scss");
  }
  return filepath;
}
