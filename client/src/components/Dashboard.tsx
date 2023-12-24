import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTable } from "react-table";
import fakedata from "../assets/fakeData.json";

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

  const [requests, setRequests] = useState<fanRequests[]>([]);

  const data = React.useMemo(() => fakedata, []);
  const columns = React.useMemo(
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
        Header: "Completion",
        accessor: "universityx",
      },
    ],
    []
  );

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:3001/dashboard", {
          params: { uid: currentUser.uid },
        });

        setRequests(response.data);
      } catch (error) {
        console.error("error: ", error);
      }
    };

    fetchRequests();
  }, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: requests,
    });

  return (
    <>
      <div className=" flex justify-center items-center overflow-hidden ">
        <div className="container bg-gray-400 w-full h-[70%]  rounded-lg overflow-auto border-4 border-gray-500   ">
          <table
            {...getTableProps()}
            className=" w-full  top-0 relative border-separate border-spacing-0 "
            // {...getTableProps()}
          >
            <thead>
              {headerGroups.map((headerGroup: any) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column: any) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-purple-400 w-full overflow-auto ">
              {requests.length != 0 &&
                rows.map((row: any) => {
                  console.log("requestS:: ", row);
                  prepareRow(row);

                  return (
                    <tr className="" {...row.getRowProps()}>
                      {row.cells.map((cell: any) => (
                        <td
                          {...cell.getCellProps()}
                          className="border-2 border-gray-500 bg-gray-800 px-10  py-10"
                        >
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
