# QR File Sharing (API)

Express server handling files sharing for [QR File Sharing (Client) app](https://github.com/gizinski-jacek/qr-file-share) app.

## Table of contents

- [QR File Sharing (API)](#qr-file-sharing-api)
  - [Table of contents](#table-of-contents)
- [Github \& Live](#github--live)
  - [Getting Started](#getting-started)
  - [Deploy](#deploy)
  - [Features](#features)
  - [Status](#status)
  - [Contact](#contact)

# Github & Live

Github repo can be found [here](https://github.com/gizinski-jacek/qr-file-share-api).

Frontend client can be found [here](https://github.com/gizinski-jacek/qr-file-share).

## Getting Started

Install all dependancies by running:

```bash
npm install
```

In the project root directory run the app with:

```bash
npm start
```

## Deploy

You can easily deploy this app using [Render Platform](https://docs.render.com).

Don't forget to add **.env** file with these environment variables for the app:

```
API_URI
CLIENT_URI
```

## Features

- API endpoints handling:
  - Creating unique directory with timestamp for users to upload files to
  - Saving files uploaded by users in their directory
  - Sharing users files by accesing their directory using unique code
  - Deleting directories and files periodically (every 5min)

## Status

Project status: **_FINISHED_**

## Contact

Feel free to contact me at:

```
gizinski.jacek.tr@gmail.com
```
