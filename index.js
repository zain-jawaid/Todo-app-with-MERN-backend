const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const {userModel,TodoModel} = require('./Models/Todo');

app.use(cors({
  origin: 'https://todo-app-with-mern-frontend.vercel.app',  // Vercel frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
const port = 4000;
// mongoose.connect('mongodb+srv://03003373096z:zain123@cluster0.w0b1b6s.mongodb.net/todo?retryWrites=true&w=majority&appName=Cluster0')
require("dotenv").config();
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB", err);
}
)

app.post('/signup',(req,res)=>{
    userModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.post('/check-email', (req, res) => {
    const { email } = req.body;
    
    userModel.findOne({ email: email })
      .then(user => {
        if (user) {
          res.json({ exists: true }); // Email is already registered
        } else {
          res.json({ exists: false }); // Email is not registered
        }
      })
      .catch(err => res.status(500).json({ message: 'Server error' }));
  });
  
app.post('/signin', (req, res) => {
    const { email, password } = req.body;
  
    userModel.findOne({ email: email })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
  
        if (user.password === password) {
          return res.status(200).json({message: "Successful" ,
          user: { name: user.name, email: user.email, id: user._id }
        });
       } else {
          return res.status(200).json({ message: "Invalid Password or Email" });
        }
      })
      .catch(err => {
        console.error("Error during sign-in:", err);
        res.status(500).json({ message: "Server error" });
      });
  });


app.post('/add',(req,res)=>{
    const task = req.body.task;
    TodoModel.create({
        task : task
    })
    .then(result=> res.json(result))
    .catch(err=> res.json(err))
})

app.get('/get',(req,res)=>{
    TodoModel.find()
    .then(result=> res.json(result))
    .catch(err=> res.json(err))
})

app.put('/update/:id',(req,res)=>{
    const {id} = req.params;
    TodoModel.findByIdAndUpdate({_id : id},{done:true})
    .then(result=> res.json(result))
    .catch(err=> res.json(err))
})

app.put('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { task } = req.body;

    TodoModel.findByIdAndUpdate(
        id,               
        { task: task },    // updating task
        { new: true }      // return updated document
    )
    .then(result => res.json(result))
    .catch(err => res.json(err));
});


app.delete('/delete/:id',(req,res)=>{
    const {id} = req.params;
    TodoModel.findByIdAndDelete({_id : id})
    .then(result=> res.json(result))
    .catch(err=> res.json(err))
})

app.delete('/deleteAll',(req,res)=>{
    TodoModel.deleteMany({})
    .then(result=> res.json(result))
    .catch(err=> res.json(err))
})

app.listen(port,()=>{
    console.log(`Server is running on Port: ${port}`);
    
})