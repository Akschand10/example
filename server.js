const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();
const port = 5050;
app.use(cors());
app.use(express.json());

const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", 
  database: "todolist",
  port: 8889,
});
database.connect((error)=> {
    if(error) {
        console.error("Error connecting to database:",error);
        return;
    }
    console.log("Connected to the database");
});
app.post("/register",(req,res)=> {
    const username = req.body.username;
    if(!username){
        return res.status(400).json({error:"Username is required"});
    }
      const checkQuery = "SELECT * FROM users WHERE username = ?";
      database.query(checkQuery, [username], (err, result) => {
        if(err) {
            console.error("Error checking existing user:", err);
            return res.status(500).json({ success:false,message:"Database error" });
        }
        if (result.length > 0){
            return res.status(400).json({ success:false,message:"Username already exists" });
        }
        database.query("INSERT INTO users(username) Values(?)", [username], (error,result)=>{
            if(error){
                console.error("Error inserting user:",error);
                return res.status(500).json({error:"Internal server error"});
            }
            res.status(200).json({ success: true, message: "User registered successfully", userId: result.insertId });
        });
});
});
app.post("/login",(req,res)=>{
    const username = req.body.username;
    if(!username){
        return res.status(400).json({error:"Username is required"});
    }
    database.query("SELECT * FROM users WHERE username = ?", [username], (error,results)=>{
        if(error){
            console.error("Error fetching user:",error);
            return res.status(500).json({error:"Internal server error"});
        }
        if(results.length === 0){
            return res.status(404).json({error:"User not found"});
        }
        res.status(200).json({ success: true,message: "Login successful",userId: results[0].id,
          });
          
    });
});
app.get("/tasks/:userId",(req,res)=> {
    const userId = req.params.userId;
    database.query("SELECT * FROM tasks WHERE user_id = ?", [userId], (error,results) => {
        if(error){
            console.error("Error fetching tasks:",error);
            return res.status(500).json({ error:"Internal server error" });
        }
        res.json(results);
    });
});
app.post("/tasks",(req,res)=> {
    const {userId,title,description,status} = req.body;
    if(!userId || !title) {
        return res.status(400).json({ error: "User ID and title are required"});
    }
    database.query("INSERT INTO tasks(user_id,title,description,status) VALUES (?,?,?,?)", [userId,title,description,status], (error,result) => {
        if(error){
            console.error("Failed to insert task:",error);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json({ message:"Task created successfully", taskId:result.insertId });
    });
});
app.put("/tasks/:taskId",(req,res)=> {
    const taskId = req.params.taskId;
    const {title,description,status} = req.body;
    database.query("UPDATE tasks SET title = ?,description = ?,status = ? WHERE id = ?",[title,description,status,taskId], (error,result) => {
        if(error){
            console.error("Failed to update task:",error);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json({ message: "Task updated successfully" });
    });
});
app.delete("/tasks/:taskId",(req,res)=> {
    const taskId = req.params.taskId;
    database.query("DELETE FROM tasks WHERE id = ?", [taskId], (error,result) => {
        if(error) {
            console.error("Failed to delete task:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        if(result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    });
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);

});