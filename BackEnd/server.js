const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs").promises;
const app = express();
const port = 8000;
const dataPath = path.join(__dirname, "data.json");
app.use(cors());
app.use(express.json());
const readData = async () => {
  try {
    const data = await fs.readFile(dataPath, "utf8");

    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

app.get("/api/getLimits", async (req, res) => {
  try {
    const data = await readData();

    const limits = {
      maxRows: data.length,
      maxColumns: Object.keys(data[0]).length,
    };

    res.json(limits);
  } catch (error) {
    res.status(500).json(`${error}: Error`);
  }
});

app.post("/api/sendData", async (req, res) => {
  try {
    const data = await readData();

    const rowReceived = Number(req.body.row);
    const columnReceived = Number(req.body.column);
    const availableColumns = Object.keys(data[0]).length;

    const selectedRows = data.slice(0, rowReceived).map((row) => {
      const selectedColumns = {};
      let count = 0;
      for (const key in row) {
        if (count < columnReceived) {
          selectedColumns[key] = row[key];
          count++;
        } else {
          break;
        }
      }
      return selectedColumns;
    });

    res.status(200).json(availableColumns < columnReceived ? [] : selectedRows);
  } catch (error) {
    res.status(500).json(`${error}: Error reading data`);
  }
});
app.listen(port, () => {
  console.log("Dynamic Table Backend listening to port 8000");
});
