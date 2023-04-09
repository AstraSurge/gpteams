<div style="font-size: 1.5rem;">
  <a href="./README.md">English</a> | 中文
</div>
</br>

**NOTICE**: 本项目采用了 Firebase Authentication，由于中国大陆用户无法使用，我们建议中国大陆用户关注以下项目：
1. https://github.com/gouguoyin/chatgpt-web (非开源项目)
2. https://github.com/Kerwin1202/chatgpt-web

[在线演示网站](https://gpteams.astrasurge.com) (每小时可以进行 3 次对话, 域名已被 DNS 污染)

# GPTeams

![GPTeams Sign in Page](https://rorsch-1256426089.file.myqcloud.com/public/202303310632157.png)

![GPteams User Management Page](https://rorsch-1256426089.file.myqcloud.com/public/202303310634302.png)

![GPteams System Settings Page](https://rorsch-1256426089.file.myqcloud.com/public/202303310632530.png)

![GPTeams Chat Page](https://rorsch-1256426089.file.myqcloud.com/public/202303310632882.png)

GPTeams 是一个专为 ChatGPT 定制的基于 OpenAI API 的第三方客户端，旨在为用户提供 OPEN AI 官方 ChatGPT 网站未涵盖的团队协作功能。

## 特点

1. 提供完全免费的部署方案，利用 Firebase 和 Railway 服务进行部署免费额度足以满足小型团队需求。
2. 支持通过 Google 账户登录、电话号码登录以及电子邮箱登录。
3. 设有管理员界面以便于管理用户，包括禁用/启用用户，删除用户等功能。
4. 系统设置页面，可以设置系统黑名单，白名单，OpenAI API Key，流量限制规则。
5. 用户可选择将本地某个会话同步至云端（待实现）。
6. 用户可将会话分享给团队中的其他成员（待实现）。

以上所述功能均已纳入开发计划，你可以在我们的 [开发看板](https://sharing.clickup.com/31625481/b/h/6-900200430791-2/756b82376fc8197) 上查看进度。如果你有更好的建议或意见，请随时通过 [contact@astrasurge.com](mailto:contact@astrasurge.com) 联系我们。

## 部署
官方支持 Railway 与 docker 两种部署方式，请移步至 [Wiki](https://github.com/AstraSurge/gpteams/wiki/%E9%83%A8%E7%BD%B2%E6%96%B9%E5%BC%8F-Deployment#zh) 查看

## 社区
你可以到 [Github Discussions](https://github.com/AstraSurge/gpteams/discussions) 参与新功能的讨论或寻求开发者的帮助。

## 鸣谢

[chatgpt-web 原项目](https://github.com/Chanzhaoyu/chatgpt-web)  
[Redon](https://github.com/Chanzhaoyu)

## License
MIT © [Astra Surge](./license)
