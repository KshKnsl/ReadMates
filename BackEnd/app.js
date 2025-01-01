const express = require("express");
const app = express();
const cors = require("cors");
const dot = require("dotenv").config();
const { connect } = require("./db/Connect");
const userRoutes = require("./routes/user.routes");
const articleRoutes = require("./routes/article.routes");
const getArticleRoutes = require("./routes/getArticle.routes");
const colaborationRoutes = require("./routes/colab.route");
const callRoutes = require("./routes/call.routes");
const puppet = require("puppeteer");

// const {protect}= require("./middlewares/authMiddleware");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.use("/api/user", userRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/getArticle", getArticleRoutes);
app.use("/api/colab", colaborationRoutes);
app.use("/api/call", callRoutes);

app.post("/api/fetch-quiz", async (req, res) => {
  const { topic, content } = req.body;
  if (!topic) {
    return res.status(400).send("Topic is required");
  }

  try {
    const browser = await puppet.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto("https://chintan.42web.io/AiQuizAPI.php");
    await page.waitForSelector("body");
    const cookies = await page.cookies();
    const testCookie = cookies.find((cookie) => cookie.name === "__test");

    if (!testCookie) {
      await browser.close();
      return res.status(400).send("Failed to retrieve __test cookie");
    }
    const response = await page.evaluate(
      async (cookieValue, topic, content) => {
        const res = await fetch("https://chintan.42web.io/AiQuizAPI.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `__test=${cookieValue};`,
          },
          body: JSON.stringify({ topic: topic, content: content }),
        });
        return res.json();
      },
      testCookie.value,
      topic,
      content
    );

    await browser.close();
    // console.log("Fetched quiz:", response);
    res.json(response);
  } catch (error) {
    console.error("Error fetching quiz:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

connect()
  .then(() => {
    app.listen(process.env.PORT || 3000, async () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => console.log(error.message));
