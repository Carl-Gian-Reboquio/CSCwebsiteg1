const express = require("express");
const cors = require("cors");

const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", applicationRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
