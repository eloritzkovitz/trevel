import { Request, Response } from "express";
import mongoose from "mongoose";
import postModel from "../models/Post";
import userModel from "../models/User";
import PostModel from "../models/Post";
import commentModel, { IComment } from "../models/Comment";
import BaseController from "./baseController";
import { deleteFile } from "../utils/fileService";

class CommentController extends BaseController<IComment> {
  constructor() {
      super(commentModel);
  }
  
  // Create new comment
  async createItem(req: Request, res: Response) {
    const postId = req.body.postId;

    if (!postId) {
      res.status(400).send({ message: "Post Id required" });
      return;
    }

    try {
      const post = await postModel.findById(postId);
      if (post) {
        const userId = req.body.sender;
        const user = await userModel.findById(userId);
        const images = req.files ? (req.files as Express.Multer.File[]).map(file => `${process.env.BASE_URL}/uploads/${file.filename}`) : [];
        const comment : IComment =  {
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
        req.body = comment;
        super.createItem(req, res);

        // Increment the commentsCount in the Post document
        await PostModel.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

      } else {
        res.status(404).send({ message: "Post not found" });
      }
    } catch (error) {
      res.status(400).send({ message: "Invalid Post Id" });
    }
  }

  // Get comments by Post ID
  async getCommentsByPostId(req: Request, res: Response): Promise<void> {
    const postId = req.params.postId;
    try {
      const comments = await this.model.find({ postId });
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }

  // Update comment
  async updateItem(req: Request, res: Response): Promise<void> {
    try {
    const commentId = req.params.id;
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
      }
     
    // Parse deleted images from request  
    const deletedImages = req.body.deletedImages ? JSON.parse(req.body.deletedImages) : [];
    
    // Handle new images
    const newImages = req.files ? (req.files as Express.Multer.File[]).map(file => file.path) : [];
    const existingImages = req.body.existingImages || [];

    // Remove deleted images
    deletedImages.forEach((image: string) => {
      deleteFile(image);
    });

  //update comment images
  const updatedImages = [...existingImages, ...newImages];

  req.body = { ...req.body, images: updatedImages, updatedAt: new Date().toISOString() };
  await super.updateItem(req, res);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
  }
}

  // Delete comment
  async deleteItem(req: Request, res: Response) {
    try {
      const commentId = req.params.id;
      const comment = await commentModel.findById(commentId);
      
      if (comment) {
        // Remove all images associated with the comment
        if (comment.images && comment.images.length > 0) {
          comment.images.forEach((image) => {
            try {
              deleteFile(image); // Safely delete each image
            } catch (error) {
              console.error(`Error deleting image: ${image}`, error);
            }
          });
        }
      
        // Decrement the commentsCount in the Post document
        try {
          await PostModel.findByIdAndUpdate(comment.postId, { $inc: { commentsCount: -1 } });
        } catch (error) {
          console.error(`Error decrementing commentsCount for post: ${comment.postId}`, error);
        }
      }

      await commentModel.deleteMany({commentId});
      await super.deleteItem(req, res);      
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
    else {  
      res.status(500).json({ error: "An unknown error occurred" });
    }
    }
  }
}

export default new CommentController();