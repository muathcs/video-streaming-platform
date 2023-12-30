import { useEffect, useState } from "react";
import axios from "../api/axios";
import { CelebType } from "../TsTypes/types";

interface Data {
  user: string;
}
export function useGlobalDataFetch(dataToFetch: string, params?: unknown) {
  const [fetchedData, setFetchedData] = useState<unknown[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/${dataToFetch}`,
          {
            params: { data: params },
          }
        );

        setFetchedData(response.data);
      } catch (error) {
        console.log("first");
      }
    };

    fetchData();
  }, [dataToFetch]);

  return fetchedData;
}
