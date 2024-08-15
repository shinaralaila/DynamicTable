import React from "react";

const Table = ({ data, loading, dataFetched, maxRows }) => {
  if (!dataFetched) {
    return null;
  }
  if (loading) {
    return <p className="text-blue-500  mt-8">Loading...</p>;
  }

  if (!data || data.length === 0)
    return (
      <div className="flex items-center justify-center bg-white-100">
        <div className="w-64 h-32 bg-white shadow-md flex items-center justify-center rounded-lg mb-9 mt-8 mx-4">
          <p className="text-gray-700 text-lg">No Data Available</p>
        </div>
      </div>
    );

  const columns = Object.keys(data[0]);

  return (
    <>
      {dataFetched ? (
        <div className="relative overflow-x-auto overflow-y-auto  shadow-md sm:rounded-lg mx-8 my-8">
          <table className=" overflow-y-auto min-w-full divide-y  text-sm text-left rtl:text-right text-gray-500  mt-8  ">
            <thead className="  text-xs text-gray-700 uppercase bg-green-200 ">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-6 py-3" scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-green-100 divide-y divide-gray-200">
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="bg-green-100 border-b hover:bg-gray-50"
                >
                  {columns.map((column) => (
                    <td key={column} className="px-6 py-4">
                      {row[column]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Table;
