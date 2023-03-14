# ChatGPT Web with google sign in

![demo](https://rorsch-1256426089.file.myqcloud.com/public/202303130217419.png)


<div style="font-size: 1.5rem;">
  <a href="./README.md">中文</a> |
  <a href="./README.en.md">English</a>
</div>
</br>

基于 [chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web), 添加了 google 账号鉴权功能。使用方式和 [chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web) 一样, 只是新增了一些环境变量。

## 前端新增环境变量
- `VITE_GOOGLE_CLIENT_ID`，必需。 [获取 Google API 客户端 ID](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid?hl=zh-cn#get_your_google_api_client_id)。

## 后端新增环境变量
- `GOOGLE_CLIENT_ID`, 必需。[获取 Google API 客户端 ID](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid?hl=zh-cn#get_your_google_api_client_id)。

- `AUTH_EMAIL_REGEX`, 必需。用于匹配邮箱的正则表达式。使用场景例子：你的公司/组织邮箱后缀为 @anarch.studio, 那么此处填写 `@anarch.studio$` 就可以让你的公司/组织朋友们和你一起使用了。

- `CORS_ORIGIN`, 可选。HTTP 的 [Access-Control-Allow-Origin](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) 字段，用于跨域控制。

## 注意事项
因为前端的变量是在编译时期注入的，所以使用 docker 部署的同学在构建时需要设置一下 build arg:
```sh
sudo docker build --build-arg VITE_GOOGLE_CLIENT_ID=xxxxxxx.apps.googleusercontent.com -t  chatgpt-web . # 不要忘记将 xxxxxxx.apps.googleusercontent.com 替换为你自己的 google client id.
```
