//Basic outline
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"));

//routes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"))
});

app.get("/api/notes", (req, res) => {
    fs.readFile("db/db.json", (err, data) => {
        if(err) throw err;
        const parsedData = JSON.parse(data);
        res.json(parsedData)
    })
});
app.post(`/api/notes/`,(req,res)=>{
    fs.readFile("db/db.json",(err,data)=>{
        if(err) throw err;
        const parsedData = JSON.parse(data);
        parsedData.push(req.body);
        fs.writeFile("db/db.json", JSON.stringify(parsedData) ,(err)=>{
            
            res.json(parsedData);
        })
    }
    )
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
});
//add id to database 
app.delete(`/api/notes/${id}`,(req,res)=>{
    //LOOK FOR ID AND THEN delete from the file
    const{ id } = req.params; 
    fs.readFile("db/db.json",(err,data)=>{
        if(err) throw err;
        const parsedData = JSON.parse(data);
       
        fs.writeFile("db/db.json", JSON.stringify(parsedData) ,(err)=>{
            
            res.json(parsedData);
        })
    })
    //
})

//run the server
app.listen(PORT, (err) => {
    if(err) throw err;
    console.log("server is now running")
})
