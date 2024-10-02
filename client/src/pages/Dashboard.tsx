import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePagination, useTable } from "react-table";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utilities/fetchPath";
import axios from "../api/axios";
import { RequestType, notification } from "../TsTypes/types";
import Modal from "../components/Modal";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import { calculateTimeLeftForCelebrityReply } from "../utilities/timeLeftForRequest";

const emptyArray: any = [];

type dataType = {};
function Dashboard() {
  const { currentUser }: any = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<RequestType[] | any>();
  const [openModal, setOpenModal] = useState(false);
  const { data: sendPutRequest, loading, error } = useGlobalAxios("put");
  const [rejectedRequestId, setRejectedRequestId] = useState<string>("");
  const [rejectionMessage, setRejectionMessage] = useState<string>(""); // celeb message for they have been rejected.
  useEffect(() => {
    const getRequests = async () => {
      try {
        const response = await axios.get(`${apiUrl}/request/dashboard`, {
          params: { data: currentUser.uid },
        });

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
        Header: "Time Left",
        accessor: "timeleft",
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
    gotoPage,
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
    setOpenModal(false);
    const requestid = rejectedRequestId;

    console.log("rejected: ", rejectedRequestId);
    try {
      const response = await sendPutRequest(
        `${apiUrl}/request/reject/${rejectedRequestId}`,
        {
          uid: currentUser.uid,
          rejectionMessage,
        }
      );
      setData(response.data); // reset data after one request has been rejected.
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className=" flex justify-center items-center  bg-[#121114]   h-[100vh]">
        <div className="container bg-[#26242a] w-full h-[70%]  rounded-lg  border border-gray-200    ">
          <Modal openModal={openModal} setOpenModal={setOpenModal}>
            <div className="flex flex-col p-8 bg-gray-800 w-full h-full shadow-md hover:shadow-lg rounded-2xl">
              <div className="flex items-start justify-between">
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
                  <div className="flex flex-col ml-4">
                    <div className="text-lg font-semibold leading-none text-gray-100">
                      Are you sure you want to reject this request?
                    </div>
                    <p className="text-sm text-gray-400 leading-tight mt-2">
                      By rejecting this request, the fan will be refunded.
                    </p>
                    <textarea
                      value={rejectionMessage}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setRejectionMessage(e.target.value);
                      }}
                      placeholder="Add a reason for the rejection (optional)"
                      className="mt-4 rounded-lg bg-gray-700 p-4 h-24 w-full text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md resize-none"
                    />
                  </div>
                </div>
                <div className="flex items-center ml-4">
                  <button
                    onClick={() => handleRejection()}
                    className="bg-red-600 hover:bg-red-700 px-6 py-2 text-white font-semibold rounded-full transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Reject
                  </button>
                </div>
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
                          ) : cell.column.id == "timeleft" ? (
                            <p>
                              <p>
                                {(() => {
                                  const timeLeft =
                                    calculateTimeLeftForCelebrityReply(
                                      row.original.timestamp1
                                    );

                                  if (timeLeft == "expired") {
                                    return (
                                      <p className="text-red-500">expired</p>
                                    );
                                  } else {
                                    return <p className="">{timeLeft}</p>;
                                  }
                                })()}
                              </p>
                            </p>
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

              {pageOptions.map((pageIndex: number) => {
                if (pageIndex > 4) {
                  return;
                }
                return (
                  <li key={pageIndex}>
                    <a
                      href="#"
                      onClick={() => gotoPage(pageIndex)}
                      className="flex items-center justify-center px-3 h-full leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      {pageIndex + 1}
                    </a>
                  </li>
                );
              })}

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
