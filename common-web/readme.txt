1. 推荐使用yarn安装依赖。如果使用npm，请保证其版本>=7.0，并使用命令：npm install --legacy-peer-deps
2. @types/react不支持安装多版本，请保证只安装一份
3. 通常使用yarn start以开发模式运行，该命令通常包含2个子命令：yarn mock && yarn dev，也可以自己分开运行
4. 使用yarn mock可以运行模拟API假数据，实际项目中可以直接对接真实API

- `yarn start` 以开发模式运行
- `yarn build` 编译到dist目录
- `yarn demo` 以产品模式运行
- 打开浏览器: http://localhost:4003/