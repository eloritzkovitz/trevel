import mongoose from "mongoose";

export interface ILikeable {
  likes: mongoose.Schema.Types.ObjectId[];
  likesCount: number;
}