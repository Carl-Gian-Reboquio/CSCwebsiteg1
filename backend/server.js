const express = require("express");
const cors = require("cors");

const applicationRoutes = require("./routes/applicationRoutes");
const loginRoutes = require("./routes/loginRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const dashboardUpdateRoutes = require("./routes/dashboardUpdateRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", applicationRoutes);
app.use("/api", loginRoutes);
app.use("/api/dashboard/update", dashboardUpdateRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Debug: log every incoming request
app.use((req, res, next) => {
  console.log(`[UNMATCHED] ${req.method} ${req.url}`);
  next();
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
  console.log("Update routes registered at /api/dashboard/update");
});

