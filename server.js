//Basic outline
const express = require("express");
const path = require("path");
const uuid = require('uuid');
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"));
//modify data in JSON to have ids
// const jsonData = JSON.parse(fs.readFile('db/db.json','utf8'));
// const noteItems = jsonData.items;
// console.log(noteItems);
// noteItems.forEach((item,index)=>{
//     item.id = index + 1;
// });
// fs.writeFileSync('db/db.json',JSON.stringify(noteItems));
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
//creat id for incoming data all the data
app.post(`/api/notes/`,(req,res)=>{
    fs.readFile("db/db.json",(err,data)=>{
        if(err) throw err;
        const parsedData = JSON.parse(data);
        const {title,text} = req.body;        
        const id = uuid.v4();

        const newItem = {id, title, text};
        parsedData.push(newItem);
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
app.delete(`/api/notes/:id`,(req,res)=>{
    //LOOK FOR ID AND THEN delete from the file
   
    fs.readFile("db/db.json",(err,data)=>{
        if(err) throw err;
        const parsedData = JSON.parse(data); 
        const noteId = req.params.id; 
        const noteIndex = parsedData.findIndex(parsedData => parsedData.id == noteId);
        if(noteIndex>=0){
        parsedData.splice(noteIndex,1);
        }
       
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
