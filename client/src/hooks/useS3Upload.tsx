// import { useState, useCallback } from "react";
// import AWS from "aws-sdk";

// const s3 = new AWS.S3({
//   accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
//   secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
//   region: "eu-west-2", // Replace with your AWS region
// });

// export default s3;

// export function useS3Upload() {
//   const [s3FileUrl, setS3FileUrl] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);

//   const uploadToS3 = useCallback(async (params: any) => {
//     try {
//       setLoading(true);
//       const response = await s3.upload(params).promise();
//       setS3FileUrl(response.Location);

//       console.log("File Uploaded Successfully: ", response.Location);
//       return response.Location;
//     } catch (error: any) {
//       console.error("Error Uploading File to S3", error.message || error);
//       // Throw the error to handle it in the calling code
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return { uploadToS3, s3FileUrl, loading };
// }
