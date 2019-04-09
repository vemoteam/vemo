# 指南

## 初始化项目

```js
mkdir demo && cd demo

vemo init

root:demo root# vemo init
? Please input project name http
❯ http 
❯ websocket
? Please select template type http
```

## 开发环境启动服务

```js
npm start
```

## 生产环境启动服务

方法一：用 vemo 自带的进程管理器

```js
npm run dist
```

方法二：用 pm2 进程管理器

```js
npm i -g pm2

npm run pm2
```