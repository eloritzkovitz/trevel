import mongoose from "mongoose";

export interface IPost {
  sender: mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
  images?: string[];
  likes: mongoose.Schema.Types.ObjectId[];
  likesCount: number;
  comments: mongoose.Schema.Types.ObjectId[];
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
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: [],
  }], 
  createdAt: {
    type: String,
  },
  updatedAt: {
    type: String,    
  }, 
});

const postModel = mongoose.model<IPost>("Posts", postSchema);

export default postModel;