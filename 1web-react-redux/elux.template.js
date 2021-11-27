module.exports = {
  title: "web-react-redux",
  platform: ["csr", "ssr"],
  framework: ["reactRedux"],
  css: ["less", "sass"],
  include: ["../common-web"],
  data(options) {
    return {
      ...options,
      css: options.css === "less" ? "less" : "scss",
      elux: "react-redux-web",
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
      if (filepath.endsWith(".tsx") || filepath.endsWith(".vue")) {
        return code.replace(/(import .*?['"].+?)\.less/g, "$1.scss");
      }
      if (filepath.endsWith(".less")) {
        return code
          .replace(/@(?!import|keyframes|media|\W)/g, "$")
          .replace(/(import .*?['"].+?)\.less/g, "$1.scss");
      }
    }

    return code;
  },
};
