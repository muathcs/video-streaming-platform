import axios from "../api/axios";
import { apiUrl } from "../utilities/fetchPath";

export function useGlobalPut() {
  const sendData = async (dataToPost: string, params?: unknown) => {
    try {
      const response = await axios.post(`${apiUrl}/${dataToPost}`, params);

    } catch (error) {
      console.error(error);
    }
  };

  return { sendData };
}
