# 命令行

## 初始化项目

```js
// 在当前目录初始化
mkdir demo && cd demo
vemo init 

// 在指定目录初始化
vemo init ./demo
```

## 开发环境启动服务

```js
vemo dev
```

## 生产环境启动服务

```js
vemo start
```

## 罗列所有生产环境服务程

```js
vemo list

// 输出结果
╔══════╤════════════════╤═════════╗
║ id   │ name           │ uptime  ║
╟──────┼────────────────┼─────────╢
║ 5352 │ vemo-demo-http │ 11:11AM ║
╚══════╧════════════════╧═════════╝
```

## 生产环境重启服务

```js
vemo restart <process_name>
```

## 生产环境停止服务

```js
vemo stop <process_name>
// 或 
vemo delete <process_name>
```