import { useCallback, useEffect, useState } from "react";
import axios from "../api/axios";
import { CelebType } from "../TsTypes/types";

export function useGlobalPut() {
  const sendData = async (dataToPost: string, params?: unknown) => {
    console.log("params: ", params, "datatopost: ", dataToPost);
    try {
      const response = await axios.post(
        `http://localhost:3001/${dataToPost}`,
        params
      );

      console.log("REs: ", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return { sendData };
}
