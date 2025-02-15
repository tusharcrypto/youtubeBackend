import mongoose from "mongoose";
import { Channel } from "./Channel.model.js ";
const commentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  comment: { type: String, required: true },
  commentslikecount: { type: Number, default: 0 },
});

const videoSchema = new mongoose.Schema({
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Channel,
    required: true,
  },
  title: { type: String, required: true },
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  description: { type: String, required: true },
  videoId: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  category: { type: String, required: true },
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
});

export const Video = mongoose.model("Video", videoSchema);
