import { useEffect, useState } from "react";
import axios from "../api/axios";
import { apiUrl } from "../utilities/fetchPath";

export function useGlobalDataFetch(dataToFetch: string, params?: unknown) {
  const [fetchedData, setFetchedData] = useState<unknown[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/${dataToFetch}`, {
          params: { data: params },
        });

        setFetchedData(response.data);
      } catch (error) {
        console.log("first");
      }
    };

    fetchData();
  }, [dataToFetch]);

  return fetchedData;
}
