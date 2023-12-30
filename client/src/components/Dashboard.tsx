import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Column, useTable } from "react-table";
import fakedata from "../assets/fakeData.json";
import { useNavigate } from "react-router-dom";
import { useGlobalDataFetch } from "../hooks/useGlobalDataFetch";
import { CelebType } from "../TsTypes/types";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
type fanRequests = {
  email: string;
  from: string;
  to: string;
  type: string;
  action: string;
  message: string;
};
function Dashboard() {
  const { currentUser }: any = useAuth();
  const navigate = useNavigate();
  const requests: any = useGlobalDataFetch("dashboard", currentUser.uid);
  const data = useGlobalAxios(
    "get",
    "http://localhost:3001/dashboard",
    currentUser.uid
  );

  console.log("data: ", data);

  function handleFulfillReq(row: any) {
    const state = row.original;

    navigate(`/fulfill/${row.original.requestid}`, { state });
  }

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
        accessor: "req_type",
      },
      {
        Header: "Action",
        accessor: "requestaction",
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
        Header: "Completion",
        accessor: "universityx",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: requests,
    });

  return (
    <>
      <div className=" flex justify-center items-center overflow-hidden bg-[#121114] h-full">
        <div className="container bg-gray-400 w-full h-[70%]  rounded-lg overflow-auto border-4 border-gray-500    ">
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
            <tbody className="bg-purple-400 w-full overflow-auto ">
              {requests.length != 0 &&
                rows.map((row: any) => {
                  prepareRow(row);

                  return (
                    <tr className="" {...row.getRowProps()}>
                      {row.cells.map((cell: any) => (
                        <td
                          {...cell.getCellProps()}
                          className="border-2 border-gray-500 bg-gray-800 px-10  py-10"
                        >
                          {cell.column.id == "universityx" ? (
                            <>
                              <input className=" w-4 h-4 " type="checkbox" />
                            </>
                          ) : cell.column.id == "reply" ? (
                            <>
                              <button
                                onClick={(e) => handleFulfillReq(row)}
                                className="py-3 px-5 bg-red-500 hover:bg-red-600 cursor-pointer rounded-md text-center table-cell align-middle"
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
        </div>
      </div>
    </>
  );
}

export default Dashboard;
