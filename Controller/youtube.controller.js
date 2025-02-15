import User from "../Model/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import { Video } from "../Model/vedio.model.js";
import { Channel } from "../Model/Channel.model.js";

dotenv.config();
//homepage vdeio
export async function homepagevedio(req,res){
  try {
    const vedio = await Video.find().populate('channel')
    console.log(vedio)
    res.send(vedio);
  } catch (error) {
    res.send(error)
  }
   
}

export function vediobycategory(req,res){

}
//viddeo by id
export async function vediobyid(req,res){
  try {
    const {videoid}= req.params;
    // console.log(videoid)
    const video = await Video.findById(videoid).populate("channel");
    if(!video){
      return res.status(404).json({msg:"This vedio it deleted"})
    }
    // console.log("video find",video)
    res.send(video);
 
  } catch (error) {
    res.send(error)
  }

}

export async function addvideobyChannel(req, res) {
  try {
    const { channelId, title, description, videoId, thumbnailUrl, category,comments } = req.body;

    
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Create a new video
    const newVideo = new Video({
      channel: channelId,
      title,
      description,
      videoId,
      thumbnailUrl,
      category,
      comments
    });

    // Save to database
    await newVideo.save();

    res.status(201).json({ message: "Video uploaded successfully", video: newVideo });

  } catch (error) {
    console.error("Error adding video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getvediobychannel(req,res){
  try {
    const {id} = req.params;
    const channeldata = await Video.find().populate('channel')
    const filertdata = channeldata.filter(video => video.channel._id.toString()==id)
    // console.log(filertdata)
    if(!channeldata){
      return res.status(404).json({msg:"Channel not found"})
    }
    res.status(200).json(filertdata);
  } catch (error) {
    res.status(400).json(error)
  }
}

// delete video by channel
export async function deletevideobychannel(req,res){
 try {
  const {channelID,videoID} = req.body;
  const channel = await Video.findByIdAndDelete(videoID)
  console.log(channel)
  
 } catch (error) {
  res.send(error)
 }
}
//update the vedio likes
export async function updatelikebyvedio(req,res){
 try {
  const {id,like} = req.body;
  if(!id){
    return res.status(404).json({msg:"Video no longer exsits"})
  }
  const videoinfo = await Video.findById(id);
  const likecnt = videoinfo.likeCount;
  if(like){
    const updatelike = await Video.findByIdAndUpdate(id,{
      likeCount:likecnt+1
    },{new:true})
  }else{
    const updatelike = await Video.findByIdAndUpdate(id,{
      likeCount:likecnt-1
    },{new:true})
  }
 res.send("Like update succfully")
 } catch (error) {
  res.status(404).json({error:error})
 }
}

//create channel
export async function createChannel(req,res){
 const {
  channelName,description,owner,profileimage,channelbanner
 } = req.body;

 if(!channelName || !description || !owner){
  return res.status(401).json({msg:"Every filed is required"})
 }
 const channel = await Channel({
  channelName:channelName,
  description:description,
  owner:owner
 })
 await channel.save();
 res.status(200).json("Channel Created Succesfully")
}

//display all channel
export async function allchannel(req,res){
  const {userid} = await req.params;
  const channels = await Channel.find({owner:userid})
  if(!channels){
    return res.status(404).json({msg:"no channels found new one"})
  }
 res.status(200).json(channels)
}
// register the user
export async function registeruser(req,res){
   try {
    const{username,useremail,password} = req.body;
    // console.log(username,useremail,password);
    const exsistinguser = await User.findOne({useremail})
    if(exsistinguser){
     return res.status(409).json({"message":"user all ready exists login directly"})
    }
    const haspassword = await bcrypt.hash(password,10);
   const newUser = new User({
    username:username,
    useremail:useremail,
    password:haspassword
   })
   await newUser.save();
    res.status(200).json({"message":"user register successfuly" });
   } catch (error) {
    res.status(400).json({message:"Something went wrong"})
   }

}

//login user
export async function loginuser(req,res){
  try {
    const { useremail, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ useremail });
    if (!user) {
      return res.status(404).json({ msg: "User does not exist, register now" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    // console.log("Logged In");

    // Generate JWT token (Do not include password)
    const token = jwt.sign(
      { userId: user._id, email: user.useremail }, // Secure payload
      process.env.SIGNATURE,
      { expiresIn: "15min" }
    );

    // Send token in response
    res.status(200).json({ msg: "Logged In", token ,user});
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }

}
//update subsciber
export async function updatesubscriber(req, res) {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ msg: "Something went wrong" });
    }

    const channelInfo = await Channel.findById(id);
    if (!channelInfo) {
      return res.status(404).json({ msg: "Channel not found" });
    }

    let updateinfo;

    if (!channelInfo.issubscribed) {
      updateinfo = await Channel.findByIdAndUpdate(
        id,
        { subscribercount: channelInfo.subscribercount + 1, issubscribed: true },
        { new: true } 
      );
    } else {
      updateinfo = await Channel.findByIdAndUpdate(
        id,
        { subscribercount: channelInfo.subscribercount - 1, issubscribed: false },
        { new: true }
      );
    }

    res.json({
      subcnt: updateinfo.subscribercount,
      issub: updateinfo.issubscribed,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}


export async function addcomment(req,res){
  try {
    const {username,comment,videoId} = req.body;
    const video = await Video.findById(videoId)
    if(!video){
      res.status(404).json({msg:'Video not found'})
    }
    const newcomment={
      username:username,
      comment:comment,
    }
    video.comments.push(newcomment);
    await video.save();
    res.status(201).json({ message: "Comment added successfully", video })
  } catch (error) {
    console.log(error)
    res.status(404).json(error)
  }

}

export async function editcomment(req, res) {
  const { commentId, updatedComment } = req.body; 
  console.log("commetID",commentId)

  try {
    // Find the video that contains the comment
    const video = await Video.findOne({ "comments._id": commentId });
    console.log("comments", video)
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Find the index of the comment inside the comments array
    const commentIndex = video.comments.findIndex((comment) => comment._id.toString() === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Update the comment text
    video.comments[commentIndex].comment = updatedComment;

    // Save the video document with the updated comment
    await video.save();

    return res.status(200).json({ message: "Comment updated successfully", updatedComment: video.comments[commentIndex] });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Failed to update comment" });
  }
}

// Delete comment
export async function deletecomment(req, res) {
  const { commentId } = req.body; // Get the comment ID from the request body
  console.log(commentId)

  try {
    // Find the video that contains the comment
    const video = await Video.findOne({ "comments._id": commentId });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Remove the comment from the comments array
    video.comments = video.comments.filter((comment) => comment._id.toString() !== commentId);

    // Save the video document with the removed comment
    await video.save();

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Failed to delete comment" });
  }
}

//update views

export async function updateview(req, res) {
  try {
    const { id } = req.body;  
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).send({ message: 'Video not found' });
    }

   
    video.viewCount += 1;
    await video.save(); 
    res.status(200).send({ viewCount: video.viewCount });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating view count' });
  }
}
//update channelinfo

export async function updateCahnnelInfo(req, res) {
  try {
    const { channelID, updatedtitle, updateddesp } = req.body;
    const channel = await Channel.findByIdAndUpdate(
      channelID,
      { channelName: updatedtitle, description: updateddesp },
      { new: true }
    );

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    res.json(channel);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}

//delete channel
export async function deletechannel(req, res) {
  try {
    const { channelID } = req.body;
    const deletedChannel = await Channel.findByIdAndDelete(channelID);

    if (!deletedChannel) {
      return res.status(404).json({ msg: "Channel not found" });
    }

    res.status(200).json({ msg: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
