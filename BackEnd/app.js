const express = require("express");
const app = express();
const cors = require("cors");
const dot = require("dotenv").config();
const { connect } = require("./db/Connect");
const userRoutes = require("./routes/user.routes");
const articleRoutes = require("./routes/article.routes");
const getArticleRoutes = require("./routes/getArticle.routes");
const colaborationRoutes = require("./routes/colab.route");
// const {protect}= require("./middlewares/authMiddleware");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.use("/api/user", userRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/getArticle", getArticleRoutes);
app.use("/api/colab", colaborationRoutes);
connect()
  .then(() => {
    app.listen(process.env.PORT || 3000, async () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => console.log(error.message));
