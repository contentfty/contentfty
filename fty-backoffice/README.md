
# 系统服务客户端
    注意：
    需要 Node 8+、 Redis、Nginx、PM2 环境的支持，请确保服务器上安装相关环境
    系统基于 vue nuxtjs 采用服务端渲染架构
    服务启动需要访问到 api 服务器上的 redis 服务，用于请求共享的服务数据

# 基本运行
## 前置准备 
1. 确认 API Server 已正常运行
2. 修改 api 服务地址

    api.config.js
    
3. 配置好 nginx
 
  参考 nginx.conf
     
## Install dependencies

```
npm install
```

## Start server

```
npm start
```

## Deploy with pm2

Use pm2 to deploy app on production enviroment.

```
pm2 startOrReload pm2.json
```

