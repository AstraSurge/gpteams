<div style="font-size: 1.5rem;">
  中文 | <a href="./README.en.md">English</a>
</div>
</br>

**通知**：已发布 `1.0.0-beta` 版本，详见 [1.0.0-beta 更新日志](https://github.com/AstraSurge/gpteams/releases/tag/v1.0.0-beta)。我们将在近期更新 1.0.0 正式版本，涵盖 [开发看板](https://sharing.clickup.com/31625481/b/h/6-900200430791-2/756b82376fc8197) 所有 1.0.0 内容，并更新超详细的 wiki。

[在线演示网站](https://gpteams.astrasurge.com) (只有 [Astra Surge](https://astrasurge.com) 成员的组织邮箱才能登录)

# GPTeams

![GPTeams 登录页面](https://rorsch-1256426089.file.myqcloud.com/public/202303270444818.png)

![GPteams 用户管理页面](https://rorsch-1256426089.file.myqcloud.com/public/202303270444757.png)

![GPteams 系统设置页面](https://rorsch-1256426089.file.myqcloud.com/public/202303270444643.png)

GPTeams 是一个专为 ChatGPT 定制的基于 OpenAI API 的第三方客户端，旨在为用户提供 OPEN AI 官方 ChatGPT 网站未涵盖的团队协作功能。

## 特点

1. 提供完全免费的部署方案，利用 Firebase 和 Vercel 服务进行部署，免费额度足以满足小型团队需求（待实现，已排期）。
2. 支持通过 Google 账户登录、电话号码登录以及电子邮箱登录。
3. 设有管理员界面以便于管理用户，包括禁用/启用用户，删除用户等功能。
4. 系统设置页面，可以设置系统黑名单，白名单，OpenAI API Key，流量限制规则。（流量限制规则的配置待实现，已排期）。
5. 用户可选择将本地某个会话同步至云端（待实现）。
6. 用户可将会话分享给团队中的其他成员（待实现）。

以上所述功能均已纳入开发计划，你可以在我们的 [开发看板](https://sharing.clickup.com/31625481/b/h/6-900200430791-2/756b82376fc8197) 上查看进度。如果你有更好的建议或意见，请随时通过 [contact@astrasurge.com](mailto:contact@astrasurge.com) 联系我们。

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

- `ROOT_ACCOUNT`: 系统管理员账号，如果你通过 google 登录，那这里填 google 账号对应的邮箱。注意，如果你通过电话号码登录，这里需要填写你的**国家呼叫代码+电话号码**，如 `+8613498888888`。

- `GOOGLE_APPLICATION_CREDENTIALS_JSON`：JSON 字符串格式的私钥文件, 必需。请查看 [Firebase 官方文档](https://firebase.google.com/docs/admin/setup?hl=zh-cn) 获取该信息。示例:
`
'{"type": "service_account", "project_id": "xxx", "private_key_id": "xxx", "private_key": "xxx", "client_email": "xxx", "client_id": "xxx", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token", "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", "client_x509_cert_url": "xxx"}'`

其他变量请参阅 [chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web) 原项目的 README。

**注意**：最好不要使用其他变量，其他变量不受 GPTeams 保护，且可能在未来的版本删除。

### 使用 docker 部署

1. 将上文获取的**前端环境变量**填入 `.env` 中。
2. 构建 Docker 镜像：`sudo docker build -t gpteams .`
3. 运行 GPTeams 容器，注意将其中的变量替换为上文说明的后端环境变量：`sudo docker run --name gpteams -d -p 8000:3002 GOOGLE_APPLICATION_CREDENTIALS_JSON='XXXX' gpteams`


PS: 如果你认为上述操作过于复杂，请耐心等待下一个版本的发布。在下一版本中，我们将添加一键部署到 Vercel 的功能，让部署变得更加简单和方便。

## 鸣谢

[chatgpt-web 原项目](https://github.com/Chanzhaoyu/chatgpt-web)  
[Redon](https://github.com/Chanzhaoyu)

## License
MIT © [Astra Surge](./license)
