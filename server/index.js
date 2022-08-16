const express = require("express");
const path = require("path");
require('dotenv').config()
const app = express();

app.use(express.static(path.join(__dirname, "../front-end/build")));
app.get("/*", (req, res) => res.sendFile(path.join(__dirname, "./index.html")));
console.log(process.env.HOMIES)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));