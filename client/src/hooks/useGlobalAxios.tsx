import { useEffect, useReducer } from "react";
import axios from "../api/axios";

type HttpMethod = "get" | "post" | "put";

interface State {
  data: any;
  loading: boolean;
  error: any;
}

const initialState: State = {
  data: null,
  error: null,
  loading: true,
};

function reducer(state: State, action: any): State {
  switch (action.type) {
    case "post": // Include "post" case
    case "get":
      return { ...state, loading: true };

    case "success":
      console.log("again here");
      return { ...state, loading: false, data: action.payload };
    case "get_error":
    case "post_error": // Include "post_error" case
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export function useGlobalAxios(
  method: HttpMethod,
  dataToFetch: string,
  params?: unknown
) {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function postData(dataToPost: string, params?: unknown) {
    try {
      const response = await axios.post(dataToPost, params);
    } catch (error) {
      console.error(error);
    }
  }
  async function putData(dataToPost: string, params?: unknown) {
    try {
      const response = await axios.put(dataToPost, params);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: method }); // Use the method directly as the action type

      try {
        let response;

        if (method === "get") {
          response = await axios.get(dataToFetch, {
            params: { data: params },
          });
        }

        // if the request method is post or put, I return the postData function, if it's get, I return the fetched data .
        dispatch({
          type: `success`,
          payload:
            method == "get"
              ? response?.data
              : method == "post"
              ? postData
              : method == "put"
              ? putData
              : null,
        });
      } catch (error) {
        console.error(error);

        //sets error to true on the reducer function, and my componenet can destrcut this.
        dispatch({ type: `${method}_error`, payload: error });
      }
    };

    fetchData();
  }, [method, dataToFetch, params]);

  return state;
}
