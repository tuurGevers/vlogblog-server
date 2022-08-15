const express = require("express");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser")
const cors = require("cors")
const multer = require('multer')
const upload = multer({dest: 'images/'})


app.use(cors({
    origin: 'https://bnbtravelers.netlify.app'
}));

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

const db = mysql.createPool({
    host: "vlogblog.cybehe0dswf6.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "MilanIsBrons69",
    database: "vlogblog"

})

app.get("/api/getheaders", (req, res) => {
    const sqlSelect = "SELECT * FROM reizen"
    db.query(sqlSelect, (err, result) => {
        res.send(result)
    })

})

app.get("/api/getheader/:id", (req, res) => {
    const id = req.params.id
    const sqlSelect = "SELECT * FROM reizen where reisID=?"
    db.query(sqlSelect, id, (err, result) => {
        res.send(result)
    })
})

app.get("/api/getposts/:id", (req, res) => {
    const id = req.params.id
    const sqlSelect = "SELECT tekstNL,tekstEN, tekstES, postID FROM post where reisID=?"
    db.query(sqlSelect, id, (err, result) => {
        res.send(result)
    })
})

app.get("/api/getimages/", (req, res) => {
    const sqlSelect = "SELECT * FROM fotos"
    db.query(sqlSelect, (err, result) => {
        res.send(result)
    })
})

app.get("/api/getpostheaders/:id", (req, res) => {
    const id = req.params.id
    const sqlSelect = "SELECT * FROM headers where reisID=?"
    db.query(sqlSelect, id, (err, result) => {
        res.send(result)
    })
})

app.post("/api/login", (req, res) => {
    const user = {name: req.body.name, password: req.body.password}
    const sqlSelect = `SELECT * FROM admin WHERE username = ? AND password = ?`

    db.query(sqlSelect, [user.name, user.password], (err, result) => {
        if (result.length > 0) {
            res.cookie("login", result[0].Gebruikersnaam)
            res.status(200).json("logged in")
        }

    })
})

app.post("/api/createreis", (req, res) => {
    const name = req.body.name
    const date = req.body.date.substring(0, 10)
    const foto = req.body.foto
    const sqlInsert = `INSERT INTO reizen (naam, datum, foto) VALUES (?, ?, ?);`

    db.query(sqlInsert, [name, date, foto], (err, result) => {
        res.send(result)
    })

})

app.post("/api/createpost", (req, res) => {
    const tekstNL = req.body.tekstNL
    const tekstEN = req.body.tekstEN
    const tekstES = req.body.tekstES
    const reisID = req.body.reisID

    const sqlInsert = `INSERT INTO post (reisID, tekstNL, tekstEN, tekstES) VALUES (?, ?, ?, ?);`

    db.query(sqlInsert, [reisID, tekstNL, tekstEN, tekstES], (err, result) => {
        console.log(err, result)
        res.send(result)
    })

})

app.post("/api/uploadfoto", (req, res) => {
    const foto = req.body.foto
    const postID = req.body.postID


    const sqlInsert = `INSERT INTO fotos (postID, foto) VALUES (?, ?);`

    db.query(sqlInsert, [postID, foto], (err, result) => {
        console.log(err, result)
        res.send(result)
    })

})

app.post("/api/uploadheader", (req, res) => {
    const foto = req.body.foto
    const reisID = req.body.reisID


    const sqlInsert = `INSERT INTO headers (reisID, headerIMG) VALUES (?, ?);`

    db.query(sqlInsert, [reisID,foto], (err, result) => {
        console.log(err, result)
    })

})

app.post("/api/setheaders", (req, res) => {
    const headers = req.body.headers
    const sqlSelect = ``

    db.query(sqlSelect, [user.name, user.password], (err, result) => {
        if (result.length > 0) {
            res.cookie("login", result[0].Gebruikersnaam)
            res.status(200).json("logged in")
        }

    })
})

module.exports = app;

app.listen(process.env.PORT || 3000, () => {
    console.log("running on port 3000")
})
