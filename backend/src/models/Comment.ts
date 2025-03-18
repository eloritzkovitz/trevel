import mongoose from "mongoose";
import { ILikeable } from "./ILikeable";

export interface IComment extends ILikeable {
  sender: mongoose.Schema.Types.ObjectId;
  senderName?: string;
  senderImage?: string;
  postId: string;
  content: string;  
  images?: string[];   
  createdAt: string;
  updatedAt: string;   
}

const commentSchema = new mongoose.Schema<IComment>({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderName: {
    type: String,
  },
  senderImage: {
    type: String,
  },
  postId: {
    type: String,
    required: true 
  },
  content: {
    type: String,
  },
  images: {
    type:[String],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],    
  }],
  likesCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: String,
  },
  updatedAt: {
    type: String,
  },    
});

const commentsModel = mongoose.model<IComment>("Comments", commentSchema);

export default commentsModel;