import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePagination, useTable } from "react-table";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utilities/fetchPath";
import axios from "../api/axios";
import { RequestType } from "../TsTypes/types";
import Modal from "../components/Modal";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import { calculateTimeLeftForCelebrityReply } from "../utilities/timeLeftForRequest";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

function Dashboard() {
  const { currentUser }: any = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<RequestType[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const { data: sendPutRequest } = useGlobalAxios("put");
  const [rejectedRequestId, setRejectedRequestId] = useState<string>("");
  const [rejectionMessage, setRejectionMessage] = useState<string>("");

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
  }, [currentUser.uid]);

  function handleFulfillReq(row: any) {
    const state = row.original;
    navigate(`/fulfill/${row.original.requestid}`, { state });
  }

  const columns = React.useMemo(
    () => [
      { Header: "From", accessor: "fromperson" },
      { Header: "To", accessor: "toperson" },
      { Header: "Type", accessor: "reqtype" },
      { Header: "Action", accessor: "reqaction" },
      { Header: "Message", accessor: "message" },
      {
        Header: "Reply",
        Cell: ({ row }: { row: any }) => (
          <Button 
            onClick={() => handleFulfillReq(row)} 
            variant="outline" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
          >
            Reply
          </Button>
        ),
      },
      {
        Header: "Time Left",
        Cell: ({ row }: { row: any }) => {
          const timeLeft = calculateTimeLeftForCelebrityReply(row.original.timestamp1);
          return (
            <span className={timeLeft === "expired" ? "text-red-500" : ""}>
              {timeLeft}
            </span>
          );
        },
      },
      {
        Header: "Reject",
        Cell: ({ row }: { row: any }) => (
          <Button
            onClick={() => {
              setRejectedRequestId(row.original.requestid);
              setOpenModal(true);
            }}
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
          >
            Reject
          </Button>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex },
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination
  );

  async function handleRejection() {
    setOpenModal(false);
    try {
      const response = await sendPutRequest(
        `${apiUrl}/request/reject/${rejectedRequestId}`,
        {
          uid: currentUser.uid,
          rejectionMessage,
        }
      );
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table {...getTableProps()} className="w-full border-collapse border border-gray-700">
              {/* head */}
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()} className="">
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()} className="p-2 border border-gray-700 font-semibold text-left">
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="">
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} className="p-2 border border-gray-700">
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
              Previous
            </Button>
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
            <Button onClick={() => nextPage()} disabled={!canNextPage}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal openModal={openModal} setOpenModal={setOpenModal}>
        <Card className="bg-gray-800 border border-gray-700 shadow-lg rounded-lg">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-2xl font-bold text-white">Reject Request</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-4 text-gray-300">Are you sure you want to reject this request? The fan will be refunded.</p>
            <textarea
              value={rejectionMessage}
              onChange={(e) => setRejectionMessage(e.target.value)}
              placeholder="Add a reason for the rejection (optional)"
              className="w-full p-3 mb-6 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
            />
            <div className="flex justify-end space-x-4">
              <Button onClick={() => setOpenModal(false)} variant="outline" className="px-4 py-2 text-gray-300 border border-gray-500 rounded-md hover:bg-gray-700 transition duration-200 ease-in-out">
                Cancel
              </Button>
              <Button onClick={handleRejection} variant="destructive" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 ease-in-out">
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      </Modal>
    </div>
  );
}

export default Dashboard;
