// All Required Modules & Packages ==========================================
const path = require("path");
require(path.join(__dirname, "/database/connection.js"));
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");

// Port Number & Listen ===================================================
const port = process.env.PORT || 80;
app.listen(port);

// All Universal Middleware ===============================================
app.use(express.static(path.join(__dirname, "static")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/base-format.ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Routes Middleware ======================================================
app.use("/home", require("./routes/home"));
app.use("/signup", require("./routes/signup"));
app.use("/login", require("./routes/login"));
app.use("/logout", require("./routes/logout"));
app.use("/*", require("./routes/not-found"));