import mongoose from "mongoose";  

const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true
  },
  useremail:{
    type:String,
    require:true
  },
  password:{
    type:String,
    required:true
  },
  profileimage:{
    data:Buffer,
    contentTpye:String,
  }
})

const User = mongoose.model("User",userSchema);
export default User;