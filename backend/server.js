const express = require("express");
const cors = require("cors");

const applicationRoutes = require("./routes/applicationRoutes");
const loginRoutes = require("./routes/loginRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const dashboardUpdateRoutes = require("./routes/dashboardUpdateRoutes");
const dashboardDeleteRoutes = require("./routes/dashboardDeleteRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", applicationRoutes);
app.use("/api", loginRoutes);
app.use("/api/dashboard/update", dashboardUpdateRoutes);
app.use("/api/dashboard/delete", dashboardDeleteRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

