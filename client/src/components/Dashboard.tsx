import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTable } from "react-table";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utilities/fetchPath";
import axios from "../api/axios";
import { notification } from "../TsTypes/types";

function Dashboard() {
  const { currentUser }: any = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<notification[]>();
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

  console.log("data: ", currentUser.uid);

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
        Header: "Completion",
        accessor: "universityx",
      },
    ],
    []
  );

  // gets table function from the useTable custom hook.
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: data || [], // if data is not loaded yet, [] prevents error
  });

  return (
    <>
      <div className=" flex justify-center items-center overflow-hidden bg-[#121114]  h-full">
        <div className="container bg-[#26242a] w-full h-[70%]  rounded-lg overflow-auto border border-gray-200    ">
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
              {data &&
                data.length != 0 &&
                rows.reverse().map((row: any) => {
                  prepareRow(row);

                  return (
                    <tr className="" {...row.getRowProps()}>
                      {row.cells.map((cell: any) => (
                        <td
                          {...cell.getCellProps()}
                          className="border-2 border-gray-500 bg-[#121114]  px-10  py-10"
                        >
                          {cell.column.id == "universityx" ? (
                            <>
                              <input className=" w-4 h-4 " type="checkbox" />
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
        </div>
      </div>
    </>
  );
}

export default Dashboard;
