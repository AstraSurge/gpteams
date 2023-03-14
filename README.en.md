# ChatGPT Web with google sign in

![demo](https://rorsch-1256426089.file.myqcloud.com/public/202303130217419.png)


<div style="font-size: 1.5rem;">
  <a href="./README.md">中文</a> |
  <a href="./README.en.md">English</a>
</div>
</br>

Based on [chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web), this version includes the Google account authentication feature. The usage is the same as [chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web), with only a few additional environment variables added.

## New Front-end Environment Variables
- `VITE_GOOGLE_CLIENT_ID`，is required。 [Obtain your Google API client ID](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid#get_your_google_api_client_id)。

## New Back-end Environment Variables
- `GOOGLE_CLIENT_ID`, is required。[Obtain your Google API client ID](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid#get_your_google_api_client_id)。

- `AUTH_EMAIL_REGEX`, is required。It is used to match email addresses with a regular expression. For example, if the email addresses in your organization are suffixed with "@anarch.studio", enter `@anarch.studio$` here to allow your friends and colleagues from the same organization to use this app.

- `CORS_ORIGIN`, is optional。It is used for cross-domain control with the HTTP [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) field.

## IMPORTANT
Since the front-end variables are injected at compile time, if you are deploying with Docker, you need to set the build arg during the build process as follows:
```sh
sudo docker build --build-arg VITE_GOOGLE_CLIENT_ID=xxxxxxx.apps.googleusercontent.com -t  chatgpt-web . 
# Make sure to replace xxxxxxx.apps.googleusercontent.com with your own Google client ID.
```

## ROADMAP

1. Integrate Firebase to enable authentication via phone numbers or email addresses.
2. Integrate Firebase to enable user management.

Please feel free to [contact me](https://t.me/suikodev) if you have any innovative ideas to share.

ps: Firebase is chosen because it provides sufficient free quota for small-scale team usage.

## Thanks

[chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web)  
[Redon](https://github.com/Chanzhaoyu)

## License
MIT © [Suiko](./license)