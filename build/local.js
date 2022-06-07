const path = require("path");
const { fse, readDirSync } = require("@elux/cli-utils");

const dist = path.join(__dirname, "../dist/local");
const src = path.join(__dirname, "../src");
const lock = path.join(__dirname, "../lock");
console.log(`正在删除:${dist}`);
fse.removeSync(dist);
console.log(`正在复制:${src}`);
fse.copySync(src, path.join(dist, "src"));
console.log(`正在复制:${lock}`);
readDirSync(lock).forEach((file) => {
  if (file.isDirectory && file.name.endsWith("-lock")) {
      const lockDir = path.join(lock, file.name);
      fse.copySync(lockDir, path.join(dist, file.name));
  }
});
