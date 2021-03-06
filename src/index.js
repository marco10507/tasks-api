const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const { clientOrigins, serverPort } = require("./config/env.dev");
const helmet = require("helmet");

mongoose
  .connect(
    "mongodb+srv://marco:PerroRata@cluster0.ioehd.mongodb.net/random-webstite?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => {
    const app = express();

    app.use(helmet());
    app.use(cors({ origin: clientOrigins }));
    app.use(bodyParser.json());
    app.use("/api", routes);

    app.listen(serverPort, () => {
      console.log("Server has started!");
    });
  });
