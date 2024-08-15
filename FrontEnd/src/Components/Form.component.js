import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import Table from "./Table.component";

const Form = () => {
  const [row, setRow] = useState("");
  const [column, setColumn] = useState("");
  const [responseData, setResponseData] = useState([]);

  const [maxRows, setMaxRows] = useState(null);
  const [maxColumns, setMaxColumns] = useState(null);

  const [columnError, setColumnError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    const getLimits = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/getLimits");
        setMaxRows(response.data.maxRows);
        setMaxColumns(response.data.maxColumns);
      } catch (error) {
        console.error("Error fetching limits:", error);
      }
    };

    getLimits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (column > maxColumns) {
      setColumnError(`Number of columns cannot exceed ${maxColumns}`);
      return;
    }
    setIsLoading(true);

    setColumnError("");
    setIsDataFetched(false);

    try {
      const url = `http://localhost:8000/api/sendData?rows=${row}&columns=${column}`;
      console.log(url);

      const response = await axios.post(url, {
        row,
        column,
      });
      setResponseData(response.data);
      setIsDataFetched(true);

      setRow("");
      setColumn("");

      setColumnError("");
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setIsLoading(false);
      setColumnError("");
    }
  };

  return (
    <>
      <div>
        <h5 className="text-2xl text-center mt-4 font-bold mb-4">
          Dynamic Table
        </h5>
        <form
          className=" max-w-sm sm:max-w-md mx-auto p-2 sm:p-4 space-y-2 sm:space-y-4 bg-teal-100 shadow-lg rounded-md"
          onSubmit={handleSubmit}
        >
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                for="inline-full-name"
              >
                No of rows
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                type="number"
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
                onChange={(e) => {
                  setRow(e.target.value);
                }}
                value={row}
              />
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                for="inline-password"
              >
                No of columns
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                type="number"
                class="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
                value={column}
                onChange={(e) => {
                  setColumn(e?.target?.value);
                  setColumnError("");
                }}
              />
              {columnError && (
                <p className="text-red-400 text-sm">{columnError}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="md:w-1/3"></div>
            <div className="flex justify-center md:w-2/3">
              <button
                className="shadow bg-green-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold px-4 py-2 rounded"
                type="submit"
                disabled={isLoading}
              >
                Submit
              </button>
            </div>
          </div>
        </form>

        <div className="mt-4 mx-8 p-4 bg-transparent flex justify-center rounded">
          {row > maxRows && (
            <p>{`Maximum  ${maxRows} rows can only be shown below on submit.`}</p>
          )}
        </div>
      </div>

      <Table
        data={responseData}
        loading={isLoading}
        dataFetched={isDataFetched}
        maxRows={maxRows}
      />
    </>
  );
};
export default Form;
