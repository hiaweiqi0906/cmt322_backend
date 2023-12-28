// utils/googleDrive.js
const fs = require('fs');
const { google } = require('googleapis');

const apikeys = require('../config/gdrive_api_keys.json');
const SCOPE = ['https://www.googleapis.com/auth/drive'];

// Function to provide access to the Google Drive API
async function authorize() {
  const jwtClient = new google.auth.JWT(
    apikeys.client_email,
    null,
    apikeys.private_key,
    SCOPE
  );

  await jwtClient.authorize();

  return jwtClient;
}

// Function to upload a file to Google Drive
async function uploadFile(authClient, fileToUpload) {
  return new Promise((resolve, rejected) => {
    const drive = google.drive({ version: 'v3', auth: authClient });
    const fileMetaData = {
      name: fileToUpload.originalname,
      parents: ['1DOPkDe69NwW3Y4-JFRTk7MJmToGO0igW'],
    };

    drive.files.create(
      {
        resource: fileMetaData,
        media: {
          body: fs.createReadStream(fileToUpload.path),
          mimeType: 'application/pdf',
        },
        fields: 'id',
      },
      (error, file) => {
        if (error) {
          return rejected(error);
        }
        resolve(file);
      }
    );
  });
}

async function deleteFile(authClient, fileIdToBeDeleted) {
  return new Promise((resolve, rejected) => {
    const drive = google.drive({ version: 'v3', auth: authClient });

    drive.files.delete(
      {
        fileId: fileIdToBeDeleted
      },
      (error, file) => {
        if (error) {
          return rejected(error);
        }
        resolve(file);
      }
    );
  });
}

module.exports = { authorize, uploadFile, deleteFile };
