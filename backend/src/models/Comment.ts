import mongoose from "mongoose";
import { ILikeable } from "./ILikeable";

export interface IComment extends ILikeable {
  sender: String;
  postId: string;
  content: string;  
  createdAt: string;
  updatedAt: string;   
}

const commentSchema = new mongoose.Schema<IComment>({
  sender: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true 
  },
  content: {
    type: String, 
    required: true 
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