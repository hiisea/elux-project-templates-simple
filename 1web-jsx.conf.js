return {
  platform: ["csr", "ssr"],
  framework: ["reactRedux", "vueVuex"],
  css: ["less", "sass"],
  install: ["./", "./mock"],
  getTitle(options) {
    return options.framework === "reactRedux" ? "web-react-redux" : "web-vue3-vuex（使用JSX）";
  },
  data(options) {
    return {
      ...options,
      css: options.css === "less" ? "less" : "scss",
      elux: options.framework === "reactRedux" ? "react-redux-web" : "vue-vuex-web",
      render: "jsx",
    };
  },
  operation: [{ action: "copy", from: "./common-web", to: "./$" }],
  rename(data, filepath) {
    if (data.platform === "csr" && filepath === "./src/server.ts") {
      return "";
    }
    if (data.platform !== "micro" && /\/modules\/\w+\/package\.json/.test(filepath)) {
      return "";
    }
    if (filepath.endsWith("vetur.config.js")) {
      return "";
    }
    if (data.css === "scss" && filepath.endsWith(".less")) {
      return filepath.replace(/.less$/, ".scss");
    }
    return filepath;
  },
  afterRender(data, filepath, code) {
    if (filepath.endsWith(".tsx")) {
      //jsx import 组件不需要加扩展名
      code = code.replace(/\.vue';/g, "';");
    }
    if (data.css === "scss") {
      if (filepath.endsWith(".tsx")) {
        return code.replace(/(import .*?['"].+?)\.less/g, "$1.scss");
      }
      if (filepath.endsWith(".less")) {
        return code.replace(/@(?!import|keyframes|media|\W)/g, "$").replace(/(import .*?['"].+?)\.less/g, "$1.scss");
      }
    }
    if (data.framework === "vueVuex" && filepath.endsWith("model.ts")) {
      return code
        .replace(/\breducer\b(?=.*\} from)/g, "mutation")
        .replace(/\beffect\b(?=.*\} from)/g, "action")
        .replace(/\):\s*ModuleState\s*{/g, "): void {")
        .replace(/@reducer/g, "@mutation")
        .replace(/@effect/g, "@action");
    }
    return code;
  },
};
