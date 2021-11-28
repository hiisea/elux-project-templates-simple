module.exports = {
  title: "web-vue3-vuex（使用JSX）",
  platform: ["csr", "ssr"],
  framework: ["vueVuex"],
  css: ["less", "sass"],
  include: ["../common-web"],
  data(options) {
    return {
      ...options,
      css: options.css === "less" ? "less" : "scss",
      elux: "vue-vuex-web",
      render: "jsx",
    };
  },
  rename(data, filepath) {
    if (data.platform === "csr" && filepath === "./src/server.ts") {
      return "";
    }
    if (data.css === "scss" && filepath.endsWith(".less")) {
      return filepath.replace(/.less$/, ".scss");
    }
    return filepath;
  },
  afterRender(data, filepath, code) {
    if (filepath.endsWith(".tsx")) {
      code = code.replace(/\.vue';/g, "';");
    }
    if (data.css === "scss") {
      if (filepath.endsWith(".tsx")) {
        return code.replace(/(import .*?['"].+?)\.less/g, "$1.scss");
      }
      if (filepath.endsWith(".less")) {
        return code
          .replace(/@(?!import|keyframes|media|\W)/g, "$")
          .replace(/(@import .*?['"].+?)\.less/g, "$1.scss");
      }
    }
    if (filepath.endsWith("model.ts")) {
      return code
        .replace(/\breducer\b(?=.*\} from)/g, 'mutation')
        .replace(/\beffect\b(?=.*\} from)/g, 'action')
        .replace(/\):\s*ModuleState\s*{/g, '): void {')
        .replace(/@reducer/g, "@mutation")
        .replace(/@effect/g, "@action");
    }
    return code;
  },
};
