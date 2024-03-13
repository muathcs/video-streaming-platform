import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePagination, useTable } from "react-table";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utilities/fetchPath";
import axios from "../api/axios";
import { RequestType, notification } from "../TsTypes/types";
import Modal from "./Modal";
import { useGlobalAxios } from "../hooks/useGlobalAxios";

const emptyArray: any = [];

type dataType = {};
function Dashboard() {
  const { currentUser }: any = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<RequestType[] | any>();
  const [openModal, setOpenModal] = useState(false);
  const { data: sendPutRequest, loading, error } = useGlobalAxios("put");
  const [rejectedRequestId, setRejectedRequestId] = useState<string>("");
  useEffect(() => {
    const getRequests = async () => {
      try {
        const response = await axios.get(`${apiUrl}/dashboard`, {
          params: { data: currentUser.uid },
        });

        console.log("res: ", response);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getRequests();
  }, []);

  // completes the request by the celeb to the fan.
  function handleFulfillReq(row: any) {
    const state = row.original;

    navigate(`/fulfill/${row.original.requestid}`, { state });
  }

  //table data.
  const columns: any = React.useMemo(
    () => [
      {
        Header: "From",
        accessor: "fromperson",
      },
      {
        Header: "To",
        accessor: "toperson",
      },
      {
        Header: "Type",
        accessor: "reqtype",
      },
      {
        Header: "Action",
        accessor: "reqaction",
      },
      {
        Header: "message",
        accessor: "message",
      },
      {
        Header: "Reply",
        accessor: "reply",
      },

      {
        Header: "Reject",
        accessor: "reject",
      },
    ],
    []
  );

  const limitedData = data?.slice(0, 4);
  // gets table function from the useTable custom hook.
  const {
    getTableProps,
    headerGroups,
    nextPage,
    canPreviousPage,
    previousPage,
    canNextPage,
    page,
    rows,
    pageOptions,
    prepareRow,
  } = useTable(
    {
      columns,
      data: data || emptyArray, // if data is not loaded yet, [] prevents error
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    usePagination
  );

  async function handleRejection() {
    console.log("rejectedStatE:X : ", rejectedRequestId);
    setOpenModal(false);
    const requestid = rejectedRequestId;
    try {
      const response = await sendPutRequest(`${apiUrl}/review`, {
        requestid: rejectedRequestId,
        uid: currentUser.uid,
      });

      const requestsAfterOneRequestHasBeenRejected = response.data;

      console.log("response: ", requestsAfterOneRequestHasBeenRejected);

      setData(requestsAfterOneRequestHasBeenRejected);
    } catch (error) {
      console.error(error);
    }
  }
  console.log("first");

  return (
    <>
      <div className=" flex justify-center items-center  bg-[#121114]  h-full h-[100vh]">
        <div className="container bg-[#26242a] w-full h-[70%]  rounded-lg  border border-gray-200    ">
          <Modal openModal={openModal} setOpenModal={setOpenModal}>
            <div className="flex flex-col p-8  bg-gray-800 w-full  h-full shadow-md hover:shodow-lg rounded-2xl ">
              <div className="flex items-center justify-between ">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-16 h-16 rounded-2xl p-3 border border-gray-800 text-blue-400 bg-gray-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <div className="flex flex-col ml-3">
                    <div className="font-medium leading-none text-gray-100">
                      Are you sure you want to reject?
                    </div>
                    <p className="text-sm text-gray-500 leading-none mt-1">
                      By rejecting this request, the fan will be refunded.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRejection()}
                  className="flex-no-shrink bg-red-500 hover:bg-red-600 px-5 ml-4 py-2 rounded-full"
                >
                  Yes
                </button>
              </div>
            </div>
          </Modal>
          <table
            {...getTableProps()}
            className=" w-full  top-0 relative border-separate border-spacing-0  "
            // {...getTableProps()}
          >
            <thead>
              {headerGroups.map((headerGroup: any) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column: any) => (
                    <th
                      className="pr-10 px-10  py-10 border border-gray-500"
                      {...column.getHeaderProps()}
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-purple-400 w-full  ">
              {data &&
                data.length != 0 &&
                page.reverse().map((row: any) => {
                  prepareRow(row);

                  return (
                    <tr className="" {...row.getRowProps()}>
                      {row.cells.map((cell: any) => (
                        <td
                          {...cell.getCellProps()}
                          className="border-2 border-gray-500 bg-[#121114]  px-10  py-10"
                        >
                          {cell.column.id == "reject" ? (
                            <>
                              <button
                                onClick={() => {
                                  const rejectedRequestId = row.original;

                                  setRejectedRequestId(
                                    rejectedRequestId.requestid
                                  );
                                  setOpenModal(true);
                                }}
                                className="  bg-red-500 hover:bg-red-400 px-4 py-2 rounded-lg cursor-pointer  "
                              >
                                Reject
                              </button>
                            </>
                          ) : cell.column.id == "reply" ? (
                            <>
                              <button
                                onClick={() => handleFulfillReq(row)}
                                className="py-3 px-10 bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-md text-center table-cell align-middle"
                              >
                                Reply
                              </button>
                            </>
                          ) : (
                            ""
                          )}
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <nav aria-label="Page navigation example" className="">
            <ul className="inline-flex -space-x-px text-sm h-10   ">
              <li>
                <a
                  href="#"
                  onClick={() => previousPage()}
                  className="flex items-center justify-center px-3 h-full  leading-tight text-gray-500 border border-e-0  hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Previous
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-full leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  1
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-full leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  2
                </a>
              </li>

              <li>
                <a
                  onClick={() => nextPage()}
                  href="#"
                  className="flex items-center justify-center px-3 h-full leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
