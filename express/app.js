const express = require("express")
const bodyParser = require("body-parser")
const parse = require("csv-parse").parse
const fs = require("fs")
const path = require("path")
// const folderName = require("./folder-config")

const dotenv = require("dotenv")
dotenv.config()

const folderName = process.env.DATA_PATH
const userFIlePath = "./user/user.json"
const logPath = "./logs/login.json"

const app = express()
const port = 3001

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method")
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PATCH, PUT, DELETE")
  res.header("Content-Type", "application/json;charset=utf-8")
  res.header("Allow", "GET, POST, PATCH, OPTIONS, PUT, DELETE")
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

app.get("/api/getUserList", (req, res) => {
  fs.readFile(userFIlePath, "utf-8", (err, data) => {
    if (err) {
      res.status(200).send({
        code: -2,
        msg: "Failed to get user from db!",
      })
      throw err
    }
    // parse JSON object
    const userList = JSON.parse(data.toString())
    res.status(200).send({
      code: 0,
      msg: "Success",
      data: userList,
    })
  })
})

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body
  if (username && password) {
    fs.readFile(userFIlePath, "utf-8", (err, data) => {
      if (err) {
        res.status(200).send({
          code: -2,
          msg: "Failed to get user from db!",
        })
        throw err
      }
      // parse JSON object
      const userList = JSON.parse(data.toString())
      // print JSON object
      const user = userList.find((u) => u.username == username && u.password == password)
      if (user) {
        res.status(200).send({
          code: 0,
          msg: "Success",
          data: user,
        })
        // write login log
        writeLoginLogUserLogin(user)
      } else {
        res.status(200).send({
          code: -1,
          msg: "Username or Password is not correct!",
        })
      }
    })
  } else {
    res.status(200).send({
      code: -1,
      msg: "Username or Password is not correct!",
    })
  }
})
app.post("/api/logout", async (req, res) => {
  const { id, username } = req.body
  res.status(200).send({
    code: 0,
    msg: "Logout success",
  })
  writeLoginLogUserLogout(id, username)
})
app.post("/api/addUser", (req, res) => {
  const { username, password, role } = req.body
  if (username && password) {
    fs.readFile(userFIlePath, "utf-8", (err, data) => {
      if (err) {
        res.status(200).send({
          code: -2,
          msg: "Failed to get user from db!",
        })
        throw err
      }
      // parse JSON object
      const userList = JSON.parse(data.toString())
      const duplicateUser = userList.find((user) => user.username === username)
      if (duplicateUser) {
        res.status(200).send({
          code: -1,
          msg: "Username has already existed!",
        })
        return
      }
      // print JSON object
      const newUser = {
        id: userList[userList.length - 1].id + 1,
        username,
        password,
        role,
      }
      const newData = userList.concat(newUser)
      fs.writeFile(userFIlePath, JSON.stringify(newData), (err) => {
        if (err) {
          res.status(200).send({
            code: -2,
            msg: "Error insert db!" + err,
          })
        } else {
          res.status(200).send({
            code: 0,
            msg: "Add user success",
          })
        }
      })
    })
  } else {
    res.status(200).send({
      code: -1,
      msg: "Username or Password is not correct!",
    })
  }
})
app.post("/api/deleteUser", (req, res) => {
  const { id } = req.body
  if (id) {
    fs.readFile("./user/user.json", "utf-8", (err, data) => {
      if (err) {
        res.status(200).send({
          code: -2,
          msg: "Failed to get user from db!",
        })
        throw err
      }
      let userList = JSON.parse(data.toString())
      id.forEach((d) => {
        userList = userList.filter((user) => user.id !== d)
      })
      fs.writeFile(userFIlePath, JSON.stringify(userList), (err) => {
        if (err) {
          res.status(200).send({
            code: -2,
            msg: "Error insert db!" + err,
          })
        } else {
          res.status(200).send({
            code: 0,
            msg: "Delete user success",
          })
        }
      })
    })
  } else {
    res.status(200).send({
      code: -1,
      msg: "Please select user first!",
    })
  }
})

app.post("/api/getAuditLog", (req, res) => {
  const { startTime, endTime } = req.body
  fs.readFile(logPath, "utf-8", (err, data) => {
    if (err) {
      res.status(200).send({
        code: -2,
        msg: "Failed to get user from db!",
      })
      throw err
    }
    // parse JSON object
    const loginLog = JSON.parse(data.toString())
    let validLog = loginLog.filter((log) => {
      return(startTime < log.time && log.time < endTime)
    })
    // console.log(validLog)
    res.status(200).send({
      code: 0,
      msg: "Success",
      data: validLog,
    })
  })
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

function writeLoginLogUserLogin(user) {
  const newLog = {
    time: new Date().getTime(),
    id: user.id,
    username: user.username,
    type: 'login'
  }
  fs.readFile(logPath, "utf-8", (err, data) => {
    if (err) {
      console.log("failed get log file");
      throw err
    }
    const loginLogs = JSON.parse(data.toString())
    loginLogs.unshift(newLog)
    fs.writeFile(logPath, JSON.stringify(loginLogs), (err) => {
      if (err) {
        console.log("insert log failed!")
      }
    })
  })
}
function writeLoginLogUserLogout(id, username) {
  const newLog = {
    time: new Date().getTime(),
    id: id,
    username: username,
    type: 'logout'
  }
  fs.readFile(logPath, "utf-8", (err, data) => {
    if (err) {
      console.log("failed get log file");
      throw err
    }
    const loginLogs = JSON.parse(data.toString())
    loginLogs.unshift(newLog)
    fs.writeFile(logPath, JSON.stringify(loginLogs), (err) => {
      if (err) {
        console.log("insert log failed!")
      }
    })
  })
}
