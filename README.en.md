<div style="font-size: 1.5rem;">
  <a href="./README.md">中文</a> | English
</div>
</br>


# GPTeams

![GPTeams Login Page](https://rorsch-1256426089.file.myqcloud.com/public/202303232058538.png)

GPTeams is a third-party client based on OpenAI API, customized for ChatGPT, providing team collaboration features not covered in the official OpenAI ChatGPT website.

## Features

- Provides a completely free deployment solution using Firebase and Vercel services. The free quota is enough to meet the needs of small teams (to be implemented, already scheduled).
- Supports login through Google account, phone number, and email (email function to be implemented, already scheduled).
- Equipped with an admin interface for user management, including disabling users, restricting user traffic, etc. (to be implemented, already scheduled).
- Users can choose to sync a local conversation to the cloud (to be implemented).
- Users can share conversations with other members of the team (to be implemented).

All of the above functions are included in the development plan, and you can check the progress on our [development board](https://sharing.clickup.com/31625481/b/h/6-900200430791-2/756b82376fc8197). If you have any better suggestions or comments, please feel free to contact us at [opensource@anarch.studio](mailto:opensource@anarch.studio).

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

- `OPENAI_API_KEY`: OpenAI API KEY, required.
- `GOOGLE_APPLICATION_CREDENTIALS_JSON`: The private key file in JSON string format, required. Please refer to the [Firebase official documentation](https://firebase.google.com/docs/admin/setup?hl=en) for this information. Example:
`
'{"type": "service_account", "project_id": "xxx", "private_key_id": "xxx", "private_key": "xxx", "client_email": "xxx", "client_id": "xxx", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token", "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", "client_x509_cert_url": "xxx"}'`
- `AUTH_MAIL_REGEX`: optional. Regular expression used to match email addresses. For example, if your company/organization email suffix is `@anarch.studio`, you should fill in `@anarch.studio$` so that your company/organization members can use GPTeams with you. Note that this variable may be removed in the next version as an admin management page will be added in the next version!
- `AUTH_PHONE_REGEX`: optional. Regular expression used to match phone numbers of users. Same effect as `AUTH_MAIL_REGEX`. Note that this variable may be removed in the next version as an admin management page will be added in the next version!

For other variables, please refer to the README of the original [chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web) project.

**Note**: It is best not to use other variables, as they are not protected by GPTeams and may be removed in future versions.

### Deploy using Docker

1. Fill in the **frontend environment variables** obtained above into `.env`.
2. Build the Docker image: `sudo docker build -t gpteams .`
3. Run the GPTeams container, replacing the variables with the backend environment variables described above: `sudo docker run --name gpteams -d -p 8000:3002 --env OPENAI_API_KEY='XXXXX' GOOGLE_APPLICATION_CREDENTIALS_JSON='XXXX' --env AUTH_EMAIL_REGEX='XXX.XXX' --env AUTH_PHONE_REGEX='XXXX' gpteams`

PS: If you find the above steps too complicated, please wait patiently for the next minor version release. In the next version, we will add a one-click deployment to Vercel function to make deployment even simpler and more convenient.

## Acknowledgments

[Original chatgpt-web project](https://github.com/Chanzhaoyu/chatgpt-web)  
[Redon](https://github.com/Chanzhaoyu)

## License
MIT © [Anarch Studio](./license)