# Websocket Demo

## 文档

[vemo 运行框架文档](https://github.com/vemoteam/vemo)

## 体验

```js
// 全局安装 @vemo/cli 命令行
npm i -g @vemo/cli

// 创建 demo 目录
mkdir demo

// 进入 demo 目录
cd demo

// 初始化 websocket demo
vemo init websocket

// 安装依赖
npm i

// 开发环境体验
npm start
```

## 生产环境

```js
// 通过 ftp 或者 ssh 手段将代码上传至服务器

// 然后通过 vemo 本身的命令启动服务
npm run dist // 实质是使用了 vemo start

// 使用 pm2 启动生产环境服务
npm i -g pm2

npm run pm2
```