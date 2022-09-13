const express = require("express")
const bodyParser = require("body-parser")
const parse = require("csv-parse").parse
const fs = require("fs")
const path = require("path")
const folderName = require("./folder-config")

const app = express()
const port = 3001

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  res.header("X-Powered-By", " 3.2.1")
  res.header("Content-Type", "application/json;charset=utf-8")
  next()
})

const csvPaths = {
  golenChamData: path.resolve(__dirname, `${folderName}/01GoldenCham_data.csv`),
  golenCham: path.resolve(__dirname, `${folderName}/02GoldenCham.csv`),
  g2g: path.resolve(__dirname, `${folderName}/03G2G.csv`),
  oer: path.resolve(__dirname, `${folderName}/04OER.csv`),
  ooc: path.resolve(__dirname, `${folderName}/05OOC.csv`),
  pm: path.resolve(__dirname, `${folderName}/06PM.csv`),
  season: path.resolve(__dirname, `${folderName}/07seasoning.csv`),
}

const csvData = getCsvData()

app.get("/api/getGolenChamData", (req, res) => {
  parse(csvData["golenChamData"], { columns: true }, (err, records) => {
    res.status(200).send({
      code: 0,
      msg: "Success",
      data: records,
    })
  })
})
app.get("/api/getGolenCham", (req, res) => {
  parse(csvData["golenCham"], { columns: true }, (err, records) => {
    res.status(200).send({
      code: 0,
      msg: "Success",
      data: records,
    })
  })
})
app.get("/api/getG2g", (req, res) => {
  parse(csvData["g2g"], { columns: true }, (err, records) => {
    res.status(200).send({
      code: 0,
      msg: "Success",
      data: records,
    })
  })
})
app.get("/api/getOer", (req, res) => {
  parse(csvData["oer"], { columns: true }, (err, records) => {
    res.status(200).send({
      code: 0,
      msg: "Success",
      data: records,
    })
  })
})
app.get("/api/getOoc", (req, res) => {
  parse(csvData["ooc"], { columns: true }, (err, records) => {
    res.status(200).send({
      code: 0,
      msg: "Success",
      data: records,
    })
  })
})
app.get("/api/getPm", (req, res) => {
  parse(csvData["pm"], { columns: true }, (err, records) => {
    res.status(200).send({
      code: 0,
      msg: "Success",
      data: records,
    })
  })
})
app.get("/api/getSeason", (req, res) => {
  parse(csvData["season"], { columns: true }, (err, records) => {
    res.status(200).send({
      code: 0,
      msg: "Success",
      data: records,
    })
  })
})

app.post("/login", (req, res) => {
  const { username, password } = req.body
  if (username && password) {
    if (username === "admin" && password === "1234") {
      res.status(200).send({
        code: 0,
        msg: "Success",
        data: {
          role: "admin",
        },
      })
    } else if (username === "user1" && password === "1234") {
      res.status(200).send({
        code: 0,
        msg: "Success",
        data: {
          role: "user",
        },
      })
    } else {
      res.status(200).send({
        code: -1,
        msg: "Username or Password is not correct!",
      })
    }
  } else {
    res.status(200).send({
      code: -1,
      msg: "Username or Password is not correct!",
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function getCsvData() {
  const ret = {}
  for (let k in csvPaths) {
    ret[k] = fs.readFileSync(csvPaths[k], { encoding: "utf-8" })
  }
  return ret
}
