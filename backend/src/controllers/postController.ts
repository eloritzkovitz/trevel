import { Request, Response } from "express";
import mongoose from "mongoose";
import postModel, { IPost } from "../models/Post";
import userModel from "../models/User";
import commentsModel from "../models/Comment";
import BaseController from "./baseController";
import { deleteFile } from "../utils/fileService";

class PostsController extends BaseController<IPost> {
  constructor() {
      super(postModel);
  }
  
  // Create a new post
  async createItem(req: Request, res: Response) {
    try { 
      const userId = req.params.userId;      
      const user = await userModel.findById(userId);
      const images = req.files ? (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`) : [];     
      const post: IPost = {
        ...req.body,
        sender: new mongoose.Types.ObjectId(userId),
        senderName: user ? `${user.firstName} ${user.lastName}` : "Unknown",
        senderImage: user?.profilePicture,
        likes: [],
        likesCount: 0,  
        images,      
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      req.body = post;      
      await super.createItem(req, res);

    } catch (error) {      
      res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
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
  
      // Parse deleted images from request
      const deletedImages = req.body.deletedImages ? JSON.parse(req.body.deletedImages) : [];
  
      // Handle new images
      const newImages = req.files ? (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`) : [];
      const existingImages = req.body.existingImages || [];  
  
      // Remove deleted images
      deletedImages.forEach((image: string) => {
        deleteFile(image);
      });
  
      // Update post images
      const updatedImages = [...existingImages, ...newImages];
  
      req.body = { ...req.body, images: updatedImages, updatedAt: new Date().toISOString() };
      await super.updateItem(req, res);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
    }
  }

  // Delete post
  async deleteItem(req: Request, res: Response) {
    try {
      const postId = req.params.id;
      const post = await postModel.findById(postId);
      if (post) {
        // Remove all images associated with the post
        post.images?.forEach(image => {
          deleteFile(image);
        });
      } 
      await commentsModel.deleteMany({ postId });
      await super.deleteItem(req, res);
    } catch (error) {      
      res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  }
}

export default new PostsController();