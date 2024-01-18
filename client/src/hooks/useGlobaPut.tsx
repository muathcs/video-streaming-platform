import axios from "../api/axios";

export function useGlobalPut() {
  const sendData = async (dataToPost: string, params?: unknown) => {
    console.log("params: ", params, "datatopost: ", dataToPost);
    try {
      const response = await axios.post(
        `http://localhost:3001/${dataToPost}`,
        params
      );

      console.log("Response/dataToPost: ", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return { sendData };
}
