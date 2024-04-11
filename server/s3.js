import AWS from "aws-sdk";

import { PutObjectCommand, S3, S3Client } from "@aws-sdk/client-s3";
export const AWS_LINK =
  "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/";

const bucketName = process.env.S3_BUCKET;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = "1"; // to supress the AWS V2 to V3 annoying warning that persists even after you fix it.

// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// loop over a file with lets say 100 links

export function uploadFile(fileBuffer, fileName, mimetype) {
  console.log("filenname : ", fileName);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype,
  };

  try {
    s3Client.send(new PutObjectCommand(uploadParams));
    console.log("file upload succefully", uploadParams);
  } catch (error) {
    console.log("/uploadFile Function S3 File: ", error);
  }
}

// middle ware
export async function uploadProfileImgToS3(req, res, next) {
  let { id } = req.params;
  let { uid, imgurl } = req.body;

  if (!imgurl && id) {
    // this function checks if we're updating the img or setting it for the first time. So, if the imgurl doesn't exist but the id does this means the account is setting the img
    // if this case
    imgurl = `profile/user(${id})`;
  }

  const file = req.file;

  if (!file) {
    //just incase the above passes because the firebase account is created beofre the user and so the id may still exist, this will quit the middle ware if an img file wasnt selected.
    return next(); //insures code below doesn't run.
  }

  let newUrl = AWS_LINK + imgurl;

  try {
    const uploadProf = await uploadFile(file.buffer, imgurl, file.mimetype);
    req.newUrl = newUrl;
    next();
  } catch (error) {
    console.log("error ploadprofiletos3 middleware", error);
    res.send("unable to upload profile picture to s3 storage");
  }
}

export function deleteFile(fileName) {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  return s3Client.send(new DeleteObjectCommand(deleteParams));
}

// this function creates a temp url for a specific file.
export async function getObjectSignedUrl(key) {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
  const command = new GetObjectCommand(params);
  const seconds = 60;
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });

  return url;
}

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

  // Replace with your AWS region
  region: process.env.AWS_REGION,
});

export default s3;
