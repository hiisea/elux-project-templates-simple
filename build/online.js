const path = require("path");
const archiver = require("archiver");
const { fs, readDirSync } = require("@elux/cli-utils");

const dist = path.join(__dirname, "../dist/online");
const src = path.join(__dirname, "../src");
const lock = path.join(__dirname, "../lock");
console.log(`正在删除:${dist}`);
fs.removeSync(dist);
console.log(`正在复制:${src}`);
const output = fs.createWriteStream(path.join(dist, "src.zip"));
const archive = archiver("zip", { zlib: { level: 9 } });
archive.pipe(output);
archive.directory(src, 'src');
archive.finalize();
console.log(`正在复制:${lock}`);
readDirSync(lock).forEach((file) => {
  if (file.isFile && file.name.endsWith(".zip")) {
    const lockZip = path.join(lock, file.name);
    fs.copySync(lockZip, path.join(dist, file.name));
  }
});
