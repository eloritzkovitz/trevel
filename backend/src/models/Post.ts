import mongoose from "mongoose";
import { ILikeable } from "./ILikeable";

export interface IPost extends ILikeable {
  sender: mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
  images?: string[];    
  createdAt: string; 
  updatedAt: string; 
}

const postSchema = new mongoose.Schema<IPost>({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: String,
  images: [String],
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

const postModel = mongoose.model<IPost>("Posts", postSchema);

export default postModel;