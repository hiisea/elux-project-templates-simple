module.exports = {
  title: "web-vue3-vuex（使用Template）",
  platform: ["csr", "ssr"],
  framework: ["vueVuex"],
  css: ["less", "sass"],
  include: ["../common-web"],
  data(options) {
    return {
      ...options,
      css: options.css === "less" ? "less" : "scss",
      elux: "vue-vuex-web",
      render: "tpl",
    };
  },
  rename(data, filepath) {
    if (filepath.endsWith("index.module.less")) {
      return "";
    }
    if (data.platform === "csr" && filepath === "./src/server.ts") {
      return "";
    }
    if (data.css === "scss" && filepath.endsWith(".less")) {
      return filepath.replace(/.less$/, ".scss");
    }
    if (filepath.endsWith(".tsx")) {
      return filepath
        .replace(/(\w+?)\/index\.tsx/, "$1.vue")
        .replace(/.tsx$/, ".vue");
    }
    return filepath;
  },
  beforeRender(data, filepath, code) {
    if (filepath.endsWith(".tsx")) {
      code =
        code.replace(
          "\n</template>\n<%",
          '\n</template>\n\n<script lang="ts">\n<%'
        ) + "</script>\n";
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
    if (filepath.endsWith("index.tsx")) {
      code = code
          .replace(/'\.\.\/(?=\w)/g, "'./")
          .replace(/'\.\.\/\.\.\//g, "'../");
    }
    if (data.css === "scss") {
      if (filepath.endsWith(".tsx")) {
        const arr = code.split('<style lang=')
        arr[0] = arr[0].replace(/(import .*?['"].+?)\.less/g, "$1.scss");
        if(arr[1]){
          arr[1] = arr[1].replace(/@(?!import|keyframes|media|\W)/g, "$")
          .replace(/(@import .*?['"].+?)\.less/g, "$1.scss");
        }
        return arr.join('<style lang=');
      }
      if (filepath.endsWith(".less")) {
        return code
          .replace(/@(?!import|keyframes|media|\W)/g, "$")
          .replace(/(@import .*?['"].+?)\.less/g, "$1.scss");
      }
    }
    if (filepath.endsWith("model.ts")) {
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
