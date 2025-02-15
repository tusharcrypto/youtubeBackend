import mongoose from "mongoose";
import User from "./user.model.js";
const ChannelSchema = new mongoose.Schema({
     channelName:{
   type:String,
   required:true
     },
     description:{
      type:String,
      required:true
     },
     subscribercount: {
      type: Number,
      default: 0
    },
     owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:User,
      required:true
     },
     issubscribed:{
      type:Boolean,
      default:false
     },
     videoCount:{
      type:Number,
      default:0
     },
     profileimage:{
      data:Buffer,
      contentTpye:String,
    },
    channelbanner:{
      data:Buffer,
      contentTpye:String,
    },
     createdat:{
      type:Date,
      default:Date.now
     }
})

export const Channel = mongoose.model("Channel",ChannelSchema)