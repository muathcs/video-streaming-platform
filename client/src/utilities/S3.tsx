import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: "eu-west-2", // Replace with your AWS region
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
});

export default s3;
