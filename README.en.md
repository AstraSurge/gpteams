<div style="font-size: 1.5rem;">
  <a href="./README.md">中文</a> | English
</div>
</br>

**NOTICE**: Version `1.0.0-beta` has been released. For details, see the [Releases](https://github.com/AstraSurge/gpteams/releases)。We will be updating to the 1.0.0 official version soon, covering all 1.0.0 content in the Development Dashboard, and updating the highly detailed wiki as well。

[Live demo](https://gpteams.astrasurge.com) (Only [Astra Surge](https://astrasurge.com) organization emails can log in.)

# GPTeams

![GPTeams Sign in Page](https://rorsch-1256426089.file.myqcloud.com/public/202303310623236.png)

![GPteams User Management Page](https://rorsch-1256426089.file.myqcloud.com/public/202303310622849.png)

![GPteams System Settings Page](https://rorsch-1256426089.file.myqcloud.com/public/202303310623195.png)

![GPTeams Chat Page](https://rorsch-1256426089.file.myqcloud.com/public/202303310624399.png)

GPTeams is a third-party client based on OpenAI API, customized for ChatGPT, providing team collaboration features not covered in the official OpenAI ChatGPT website.

## Features

1. Provides a completely free deployment solution using Firebase ~~and Vercel services~~(GPTeams cannot support Vercel's Hobby Plan because the limits of Vercel's Hobby Plan make it impossible to deploy GPTeams, we are currently looking for another platform that allows easy and free deployment of GPTeams.). The free quota is enough to meet the needs of small teams (to be implemented, already scheduled).
2. Supports login through Google account, phone number, and email.
3. Equipped with an admin interface for user management, including disabling users, delete users etc.
4. System settings page, admin can set blacklist, whitelist, OpenAI API key, user traffic rules.
- Users can choose to sync a local conversation to the cloud (to be implemented).
- Users can share conversations with other members of the team (to be implemented).

All of the above functions are included in the development plan, and you can check the progress on our [development board](https://sharing.clickup.com/31625481/b/h/6-900200430791-2/756b82376fc8197). If you have any better suggestions or comments, please feel free to contact us at [contact@astrasurge.com](mailto:contact@astrasurge.com).

## Quick Start

### Environment Variables

#### Frontend Environment Variables

The following variables must be set, and you can get the Firebase project configuration information from the [Firebase official documentation](https://firebase.google.com/docs/web/setup?hl=en):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

The following variables are optional:

- `VITE_APP_NAME`: Application name, which you can change to the desired name. After modification, the name will be displayed in various places (such as HTML title, login page, etc.).

#### Backend Environment Variables

The following variables must be set:

- `ROOT_ACCOUNT`: System administrator account. If you log in via Google, enter the email address associated with your Google account here. Please note, if you log in with a phone number, you need to enter your **country calling code + phone number**, such as `+19312693452`.

- `GOOGLE_APPLICATION_CREDENTIALS_JSON`: The private key file in JSON string format, required. Please refer to the [Firebase official documentation](https://firebase.google.com/docs/admin/setup?hl=en) for this information. Example:
`
'{"type": "service_account", "project_id": "xxx", "private_key_id": "xxx", "private_key": "xxx", "client_email": "xxx", "client_id": "xxx", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token", "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", "client_x509_cert_url": "xxx"}'`

For other variables, please refer to the README of the original [chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web) project.

**Note**: It is best not to use other variables, as they are not protected by GPTeams and may be removed in future versions.

### Deploy using Docker

1. Fill in the **frontend environment variables** obtained above into `.env`.
2. Build the Docker image: `sudo docker build -t gpteams .`
3. Run the GPTeams container, replacing the variables with the backend environment variables described above: `sudo docker run --name gpteams -d -p 8000:3002 GOOGLE_APPLICATION_CREDENTIALS_JSON='XXXX' gpteams`

## Acknowledgments

[Original chatgpt-web project](https://github.com/Chanzhaoyu/chatgpt-web)  
[Redon](https://github.com/Chanzhaoyu)

## License
MIT © [Astra Surge](./license)