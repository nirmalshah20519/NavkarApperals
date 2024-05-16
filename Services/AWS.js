const AWS = require('aws-sdk');
const fs = require('fs');
const FormData = require('form-data');
// const request = require('request');
const axios = require('axios');
require("dotenv").config();

// Configure AWS SDK with your credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Create S3 instance
const s3 = new AWS.S3();

// Function to upload file to S3 bucket and generate public URL
async function uploadFileToS3(bucketName, fileKey, filePath) {
  // Read file from local file system
  const fileContent = fs.readFileSync(filePath);
  // console.log(fileContent);

  // Upload file to S3 bucket
  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Body: fileContent,
    ACL: 'public-read' // Make uploaded file publicly readable
  };

  try {
    await s3.upload(params).promise();
    console.log(`File uploaded successfully to bucket: ${bucketName}, with key: ${fileKey}`);

    // Generate public URL for the uploaded file
    const publicUrl = `https://${bucketName}.s3.amazonaws.com/${fileKey}`;
    console.log(`Public URL for the file: ${publicUrl}`);

    return publicUrl;
  } catch (err) {
    console.error('Error uploading file:', err);
    throw err;
  }
}

async function sendWhatsapp(message, receiver, filePath) {
  try {
    const formData = new FormData();
    formData.append('appkey', process.env.MYRC_APP_KEY);
    formData.append('authkey', process.env.MYRC_AUTH_TOKEN);
    console.log(receiver);
    formData.append('to', receiver);
    formData.append('message', message);

    if (filePath) {
      formData.append('file', filePath);
    }

    const response = await axios.post('https://whats-api.rcsoft.in/api/create-message', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
}

module.exports = {uploadFileToS3, sendWhatsapp}