function replaceLess(code, css) {
  if (css === "scss") {
    return code
      .replace(/@(?!import|keyframes|media|\W)/g, "$")
      .replace(/(@import .*?['"].+?)\.less/g, "$1.scss")
      .replace(/(@import .*?['"])\$/g, "$1@");
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
  return code;
}

return {
  platform: ["taro"],
  framework: ["react", "vue"],
  css: ["less", "sass"],
  install: ["./", "./mock"],
  getTitle(options) {
    return options.framework === "react" ? "web-react" : "web-vue3（使用JSX）";
  },
  data(options) {
    return {
      ...options,
      css: options.css === "less" ? "less" : "scss",
      elux: options.framework === "react" ? "react-web" : "vue-web",
      render: "jsx",
    };
  },
  operation: [{ action: "copy", from: "./common-web", to: "./$" }],
  rename(data, filepath) {
    if (filepath.endsWith("vetur.config.js")) {
      return "";
    }
    if (data.platform === "csr" && filepath === "./src/server.ts") {
      return "";
    }
    if (data.platform !== "micro" && /\/modules\/\w+\/package\.json/.test(filepath)) {
      return "";
    }
    if (data.css === "scss" && filepath.endsWith(".less")) {
      return filepath.replace(/.less$/, ".scss");
    }
    return filepath;
  },
  afterRender(data, filepath, code) {
    if (filepath.endsWith(".tsx")) {
      return replaceTsx(code, data.css);
    }
    if (filepath.endsWith(".less")) {
      return replaceLess(code, data.css);
    }
    if (filepath.endsWith("model.ts")) {
      return replaceModel(code, data.framework);
    }
    return code;
  },
};
