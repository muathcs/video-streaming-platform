import { useEffect, useReducer } from "react";
import axios from "../api/axios";

type HttpMethod = "get" | "post" | "put" | "getnow";

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

// I chose to use reducer to return different outcomes from the axios requests,
// on succes, the user gets back the action payload which could be the data from the get request, or a function to put/post stuff to the database.
function reducer(state: State, action: any): State {
  switch (action.type) {
    case "loading": // Include "post" case
      return { ...state, loading: true };

    case "success":
      return { ...state, loading: false, data: action.payload };
    case "error":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export function useGlobalAxios(
  method: HttpMethod,
  dataToFetch?: string,
  params?: unknown
) {
  //useReducer returns a state with three item, data, loading, error. either loading or error will be true if data doesn't exist.
  const [state, dispatch] = useReducer(reducer, initialState);

  //function to post to the data base.
  async function postData(path: string, params?: unknown) {
    try {
      const response = await axios.post(path, params);

    } catch (error) {
      console.error(error);
    }
  }

  // function to put to the database.
  async function putData(dataToPost: string, params?: unknown) {
    try {
      const response = await axios.put(dataToPost, params);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function getData(dataToGet: string, params?: unknown) {
    try {
      const response = await axios.get(dataToGet, { params }); // Correct destructure here
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "loading" }); // Use the method directly as the action type

      try {
        let response;

        if (dataToFetch && method === "get") {
          response = await axios.get(dataToFetch, {
            params: { uid: params },
          });
        }

        // if the method is post or put, I return a function, if it's get, I return the fetched data.
        dispatch({
          type: "success",
          payload:
            method == "get"
              ? response?.data
              : method == "getnow"
              ? getData
              : method == "post"
              ? postData
              : method == "put"
              ? putData
              : null,
        });
      } catch (error) {
        console.error(error);

        //sets error to true on the reducer function, and my componenet can destrcut this.
        dispatch({ type: "error", payload: error });
      }
    };

    fetchData();
  }, [dataToFetch]);

  return state;
}
