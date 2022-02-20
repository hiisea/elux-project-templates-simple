function replaceLess(code, css) {
  if (css === "scss") {
    return code
      .replace(/@(?!import|keyframes|media|\W)/g, "$")
      .replace(/(@import .*?['"].+?)\.less/g, "$1.scss")
      .replace(/(@import .*?['"])\$/g, "$1@");
  }
  return code;
}

function replaceTsx(code, css, filepath) {
  if (filepath.endsWith("index.tsx")) {
    code = code.replace(/'\.\.\/(?=\w)/g, "'./").replace(/'\.\.\/\.\.\//g, "'../");
  }
  if (css === "scss") {
    const arr = code.split("<style lang=");
    arr[0] = arr[0].replace(/(import .*?['"].+?)\.less/g, "$1.scss");
    if (arr[1]) {
      arr[1] = arr[1]
        .replace(/@(?!import|keyframes|media|\W)/g, "$")
        .replace(/(@import .*?['"].+?)\.less/g, "$1.scss")
        .replace(/(@import .*?['"])\$/g, "$1@");
    }
    return arr.join("<style lang=");
  }
  return code;
}

function replaceModel(code, framework) {
  return code;
}

return {
  platform: ["taro"],
  framework: ["vueVuex"],
  css: ["less", "sass"],
  install: ["./", "./mock"],
  getTitle() {
    return "web-vue3（使用Template）";
  },
  data(options) {
    return {
      ...options,
      css: options.css === "less" ? "less" : "scss",
      elux: "vue-web",
      render: "tpl",
    };
  },
  operation: [{ action: "copy", from: "./common-web", to: "./$" }],
  rename(data, filepath) {
    if (filepath.endsWith("index.module.less")) {
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
    if (filepath.endsWith(".tsx")) {
      return filepath.replace(/(\w+?)\/index\.tsx/, "$1.vue").replace(/.tsx$/, ".vue");
    }
    return filepath;
  },
  beforeRender(data, filepath, code) {
    if (filepath.endsWith(".tsx")) {
      code = code.replace("\n</template>\n<%", '\n</template>\n\n<script lang="ts">\n<%') + "</script>\n";
      const cssArr = code.match(/\nimport styles from ['"](.+?)['"]/);
      if (cssArr) {
        return (
          code.replace(/\nimport styles from ['"](.+?)['"][;]?/, "") +
          `\n<style lang="<%= css %>" module>\n<%- include('${cssArr[1]}'); -%></style>\n`
        );
      }
    }
    return code;
  },
  afterRender(data, filepath, code) {
    if (filepath.endsWith(".tsx")) {
      return replaceTsx(code, data.css, filepath);
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