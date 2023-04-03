### docker-compose 部署教程
- 将打包好的前端文件放到 `nginx/html` 目录下
- ```shell
  # 启动
  docker-compose up -d
  ```
- ```shell
  # 查看运行状态
  docker ps
  ```
- ```shell
  # 结束运行
  docker-compose down
  ```
**注意，目前暂时没有精力官方支持 docker-compose 部署方式，每次的更新涉及到 docker-compose 的部分会同步修改，但是不会去测试**