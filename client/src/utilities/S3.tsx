import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  region: "eu-west-2", // Replace with your AWS region
});

const s3 = new AWS.S3();

export default s3;
