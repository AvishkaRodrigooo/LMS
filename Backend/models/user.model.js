import mongoose from "mongoose";
  
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
          type:String,
          enum:["instructor","student"],
          default:'students'
    },
    enrolledCourses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    }],
    photoURL:{
        type:String,
        default:""
    }
},{timestamps:true});

export const User = mongoose.model("User", userSchema);