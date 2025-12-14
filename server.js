const express = require('express')
const path = require('path')
require("dotenv").config()


const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

var indexRouter = require("./routes/index.js")
app.use("/", indexRouter)



const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = process.env.PORT || 5000;
const hostname = externalUrl ? '0.0.0.0' : 'localhost';

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  if (externalUrl) console.log(`Externally accessible at ${externalUrl}`);
});