# 关于本Demo

本Demo主要演示相同的业务逻辑`Modle`如何在跨项目、跨UI框架中复用。

`react-team`在开发时将`Model`与`View`分离，并将其发布成为npm包，`vue-team`直接安装`react-team`发布的`Model`包。

注意：`Model`包不只是包含Model，还可以包含通用的函数、方法、TS类型、常量定义等等，总之一切可以复用的元素都可以提取到`Model`包。
