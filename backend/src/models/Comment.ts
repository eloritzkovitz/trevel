import mongoose from "mongoose";

export interface IComment {
  sender: String;
  postId: string;
  content: string;
  likes: mongoose.Schema.Types.ObjectId[];
  likesCount: number;
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