![]()
<p align="center">
    <img src="https://main.qcloudimg.com/raw/157e6292a5a839b8e2f6a6b3501c229f.png">
</p>

简易的 Web 框架

[![NPM Version](https://img.shields.io/npm/v/@vemo/cli.svg?style=flat)](https://www.npmjs.com/package/@vemo/cli)
[![Travis](https://img.shields.io/travis/vemoteam/vemo.svg)](https://travis-ci.org/vemoteam/vemo)
![NPM](https://img.shields.io/npm/l/@vemo/cli.svg)
[![Coverage](https://img.shields.io/coveralls/vemoteam/vemo.svg)](https://coveralls.io/github/vemoteam/vemo)

## 文档
* [指南](docs/guide.md)
* [配置](docs/config.md)
* [命令行](docs/cli.md)
* [请求处理](docs/controller.md)
* [中间件](docs/middleware.md)
* [测试](docs/test.md)

## Demo
* [HTTP](demo/http/README.md)
* [Websocket](demo/ws/README.md)

## 特性
* 支持 `http` 及 `websocket`
* 支持基于模板初始化 `http` 或 `websocket` 项目
* 支持静态资源
* 支持模板渲染
* 自定义路由及入参校验
* 支持进程管理器及 `cluster` 模式（自带及 `pm2` 均支持，自带的仅支持 `Mac` 和 `Linux`）