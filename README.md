<div style="font-size: 1.5rem;">
  中文 | <a href="./README.en.md">English</a>
</div>
</br>

# [GPTeams](https://chat.anarch.studio)

![GPTeams 登录页面](https://rorsch-1256426089.file.myqcloud.com/public/202303250636392.png)

GPTeams 是一个专为 ChatGPT 定制的基于 OpenAI API 的第三方客户端，旨在为用户提供 OPEN AI 官方 ChatGPT 网站未涵盖的团队协作功能。

## 特点

1. 提供完全免费的部署方案，利用 Firebase 和 Vercel 服务进行部署，免费额度足以满足小型团队需求（待实现，已排期）。
2. 支持通过 Google 账户登录、电话号码登录以及电子邮箱登录。
3. 设有管理员界面以便于管理用户，包括禁用用户、限制用户流量等功能（待实现，已排期）。
4. 用户可选择将本地某个会话同步至云端（待实现）。
5. 用户可将会话分享给团队中的其他成员（待实现）。

以上所述功能均已纳入开发计划，你可以在我们的 [开发看板](https://sharing.clickup.com/31625481/b/h/6-900200430791-2/756b82376fc8197) 上查看进度。如果你有更好的建议或意见，请随时通过 [opensource@anarch.studio](mailto:opensource@anarch.studio) 联系我们。

## 快速开始

### 环境变量

#### 前端环境变量

以下变量是必需设置的，你可以在 [Firebase 官方文档](https://firebase.google.com/docs/web/setup?hl=zh-cn) 中获取 Firebase 项目配置信息：

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

以下变量是可选设置的：

- `VITE_APP_NAME`：应用名称，你可以将其更改为你想要的名称。修改后，名称会在各个地方（例如 HTML 标题、登录界面等）显示。

#### 后端环境变量

以下变量是必需设置的：

- `OPENAI_API_KEY`：OpenAI API KEY, 必需。
- `GOOGLE_APPLICATION_CREDENTIALS_JSON`：JSON 字符串格式的私钥文件, 必需。请查看 [Firebase 官方文档](https://firebase.google.com/docs/admin/setup?hl=zh-cn) 获取该信息。示例:
`
'{"type": "service_account", "project_id": "xxx", "private_key_id": "xxx", "private_key": "xxx", "client_email": "xxx", "client_id": "xxx", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token", "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", "client_x509_cert_url": "xxx"}'`
- `AUTH_MAIL_REGEX`: 可选。用于匹配邮箱的正则表达式。例如，如果你的公司/组织邮箱后缀为 `@anarch.studio`，则应填写 `@anarch.studio$`，以便你的公司/组织成员和你一起使用 GPTeams。注意，基于下个版本会添加 admin 管理页面，此变量可能在下个版本中删除！
- `AUTH_PHONE_REGEX`: 可选。用户匹配电话号码的正则表达式。效果如 `AUTH_MAIL_REGEX`。注意，基于下个版本会添加 admin 管理页面，此变量可能在下个版本中删除！

其他变量请参阅 [chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web) 原项目的 README。

**注意**：最好不要使用其他变量，其他变量不受 GPTeams 保护，且可能在未来的版本删除。

### 使用 docker 部署

1. 将上文获取的**前端环境变量**填入 `.env` 中。
2. 构建 Docker 镜像：`sudo docker build -t gpteams .`
3. 运行 GPTeams 容器，注意将其中的变量替换为上文说明的后端环境变量：`sudo docker run --name gpteams -d -p 8000:3002 --env OPENAI_API_KEY='XXXXX' GOOGLE_APPLICATION_CREDENTIALS_JSON='XXXX' --env AUTH_EMAIL_REGEX='XXX.XXX' --env AUTH_PHONE_REGEX='XXXX' gpteams`


PS: 如果你认为上述操作过于复杂，请耐心等待下一个小版本的发布。在下一版本中，我们将添加一键部署到 Vercel 的功能，让部署变得更加简单和方便。

## 鸣谢

[chatgpt-web 原项目](https://github.com/Chanzhaoyu/chatgpt-web)  
[Redon](https://github.com/Chanzhaoyu)

## License
MIT © [Anarch Studio](./license)
