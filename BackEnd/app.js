const express = require("express");
const app = express();
const cors = require("cors");
const dot = require("dotenv").config();
const { connect } = require("./db/Connect");
const userRoutes = require("./routes/user.routes");

app.use(cors());
app.use(express.json()); // Parses JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded payloads

app.use("/api/user", userRoutes);

connect()
  .then(() => {
    app.listen(process.env.PORT || 3000, async () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => console.log(error.message));
