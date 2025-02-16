  import express from "express";
  import dotenv from "dotenv";
  import cors from "cors";
  import routes from "./Routes/youtube.routes.js";
  import mongoose from "mongoose";
  import { Video } from "./Model/vedio.model.js";
  dotenv.config();
  const port = process.env.PORT;
  const app = express();
  app.use(cors());
  app.use(express.json())
  app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, 
  }));  ;
  app.listen(port,()=>{
    console.log(`server is listening on port:${port}`);
  })
  mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection;
  db.on("open",()=>{
    console.log("Databse is connected");
  })
  db.on("error",()=>{
    console.log("Datbase connection got failed");
  })
  routes(app)
 
  app.post("/api/vid", async (req, res) => {
    const { 
      channel,  // channel_id is passed as 'channel' here
      title, 
      viewCount, 
      likeCount, 
      description, 
      videoId, 
      thumbnailUrl, 
      category, 
      comments, 
      createdAt
    } = req.body;

    try {
      const vid = new Video({
        channel: channel,  
        title: title,
        viewCount: viewCount || 0, 
        likeCount: likeCount || 0,  
        description: description,
        videoId: videoId,
        thumbnailUrl: thumbnailUrl,
        category: category,
        comments: comments || [], 
        createdAt: createdAt || Date.now(),  
      });

      await vid.save();
      res.status(201).json({ message: "Video added successfully", video: vid });
    } catch (error) {
      console.error("Error saving video:", error);
      res.status(500).json({ message: "Error saving video", error: error.message });
    }
  });



