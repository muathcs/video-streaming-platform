// import { useState } from "react";
// import s3 from "../utilities/S3";

// export function useS3Upload() {
//   const [s3FileUrl, setS3FileUrl] = useState<string>("");
//   const uploadToS3 = async (params: any) => {
//     try {
//       const response = await s3.upload(params).promise();
//       await setS3FileUrl(response.Location);

//       console.log("File Uploaded Succefully: ", response.Location);
//       return response.Location;
//     } catch (error) {
//       console.error("Error Uploading File to S3", error);
//     }
//   };

//   return { uploadToS3, s3FileUrl };
// }
