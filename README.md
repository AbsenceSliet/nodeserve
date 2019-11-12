# nodeserver

该项目是基于express和mongodb的api接口系统

###  本地安装mongodb
- mongo --version  查看mongo 是否安装成功
-  创建data目录，用来存放数据库文件， mongoDB 会自动把自己安装位置的盘符根目录下的 data 文件夹作为自己的数据存储目录，这里也可以直接在安装位置所在盘符创建。
-  启动数据库
    如果data目录创建在安装位置的盘符根目录下， 直接打开命令行，
    ```
    mongod
    ```
    如果是其他位置，则需要指定数据存放的位置
    ```
    mongod --dbpath 路径名称 
    如果看到输出： waiting for connections on port 27017 
     打开localhost:27017 ,看到It looks like you are trying to access MongoDB over HTTP on the native driver port. 证明mongo启动成功 
    ```
-  链接数据库 .再打开命令行，输入```mongo``` 进行数据库操作。

## 开发命令


### Installation

```
$  npm install 
```
##### 开发
$ npm run dev