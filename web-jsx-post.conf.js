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
  code = code.replace(/\s+\/\*#\s+\[\[\[([+-]\d+)\s+#\*\/([\s\S]*?)\/\*#\s+\]\]\]\s+#\*\/\s+/g, (a,cmd,str)=>{
    return str.replace(/\n[ ]{4}/g, '\n');
  });

  if (css === "sass") {
    return code.replace(/(import .*?['"].+?)\.less/g, "$1.scss");
  }
  return code;
}

const valueKeys = {
  'react': 'framework',
  'vue': 'framework',
  'less': 'css',
  'sass': 'css',
  'csr': 'platform',
  'ssr': 'platform',
  'post': 'route',
}

return {
  platform: ["csr", "ssr"],
  framework: ["react", "vue"],
  css: ["less", "sass"],
  install: ["./", "./mock"],
  getTitle(options) {
    return options.framework === "react" ? "web-react（路由后置）" : "web-vue3（路由后置）";
  },
  data(options) {
    return {
      ...options,
      elux: options.framework === "react" ? "@elux/react-web" : "@elux/vue-web",
      route: "post"
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
    if (data.css === "sass" && filepath.endsWith(".less")) {
      return filepath.replace(/.less$/, ".scss");
    }
    return filepath;
  },
  beforeRender(data, filepath, code){
    return code.replace(/\/\*#\s+\=(react|vue|ssr|csr|less|sass|post|pre)\?([^:]+?):(.*?)\s+#\*\//g, (str, $1, $2, $3)=>`<%= ${valueKeys[$1]}==='${$1}'?\`${$2}\`:\`${$3}\` %>`)
    .replace(/\/\*#\s+if:(react|vue|ssr|csr|less|sass|post|pre)\s+#\*\//g, (str, $1)=>`<%_ if(${valueKeys[$1]}==='${$1}'){ -%>`)
    .replace(/\/\*#\s+else:(react|vue|ssr|csr|less|sass|post|pre)\s+#\*\//g, (str, $1)=>`<%_ }else if(${valueKeys[$1]}==='${$1}'){ -%>`)
    .replace(/\/\*#\s+else\s+#\*\//g, `<%_ }else{ -%>`)
    .replace(/\/\*#\s+end\s+#\*\//g, `<%_ } -%>`)
  },
  afterRender(data, filepath, code) {
    if (filepath.endsWith(".tsx")) {
      return replaceTsx(code, data.css);
    }
    if (filepath.endsWith(".less")) {
      return replaceLess(code, data.css);
    }
    return code;
  },
};
