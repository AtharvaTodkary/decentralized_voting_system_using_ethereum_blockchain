const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const CORS = require("cors");
require("dotenv").config();

const port = process.env.PORT || 8080;
const uri = process.env.MONGODB_URI;

app.use(CORS());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Welcome to Server!");
});

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Couldn't connect to MongoDB", error);
    process.exit(1);
  }
};

app.use('/user', require('./routes/userRouter'));
app.use("/api/voting", require('./routes/voteRouter'));

app.listen(port, ()=>{
    connectDB();
    console.log(`Server is running on port ${port}`);
})