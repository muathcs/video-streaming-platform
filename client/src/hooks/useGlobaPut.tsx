import axios from "../api/axios";
import { apiUrl } from "../utilities/fetchPath";

export function useGlobalPut() {
  const sendData = async (dataToPost: string, params?: unknown) => {
    console.log("params: ", params, "datatopost: ", dataToPost);
    try {
      const response = await axios.post(`${apiUrl}/${dataToPost}`, params);

      console.log("Response/dataToPost: ", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return { sendData };
}
