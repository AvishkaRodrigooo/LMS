import express from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import connectDB from "./database/db.js";
dotenv.config({});

//call database connection here

connectDB();
const app = express();

const PORT = process.env.PORT || 3000

app.listen(PORT, () =>{
     console.log(`server listen at port ${PORT}`);
})