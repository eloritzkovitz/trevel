import { Request, Response } from "express";
import mongoose from "mongoose";
import postModel, { IPost } from "../models/Post";
import commentsModel from "../models/Comment";
import BaseController from "./baseController";

class PostsController extends BaseController<IPost> {
  constructor() {
      super(postModel);
  }

  // Create a new post
  async createItem(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const post: IPost = {
        ...req.body,
        sender: new mongoose.Types.ObjectId(userId),
        likes: [],
        likesCount: 0,        
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      req.body = post;
      await super.createItem(req, res);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }

  // Update post
  async updateItem(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.id;
      const post = await postModel.findById(postId);
      if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
      }
      req.body = { ...req.body, updatedAt: new Date().toISOString() };
      await super.updateItem(req, res);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }

  // Delete post
  async deleteItem(req: Request, res: Response) {
    try {
      const postId = req.params.id;
      await commentsModel.deleteMany({ postId });
      await super.deleteItem(req, res);
    } catch (error) {        
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: "An unknown error occurred" });
        }
    }
  }
}  

export default new PostsController();