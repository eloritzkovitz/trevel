import { Request, Response } from "express";
import mongoose from "mongoose";
import { ILikeable } from "../models/ILikeable";

class BaseController<T extends ILikeable> {
    protected model: mongoose.Model<T>;
  
    constructor(model: mongoose.Model<T>) {
      this.model = model;
    }

    // Get all items
    async getAll(req: Request, res: Response) {
        const filter = req.query.sender;
        try {            
            if (filter) {
                const item = await this.model.find({ sender: filter });
                res.send(item);
            } else {
                const items = await this.model.find();
                res.send(items);
            }
        } catch (error) {
            res.status(400).send(error);
        }
    };

    // Get an item by id
    async getById(req: Request, res: Response) {
        const id = req.params.id;

        try {
            const item = await this.model.findById(id);
            if (item != null) {
                res.send(item);
            } else {
                res.status(404).send("Item not found");
            }
        } catch (error) {
            res.status(400).send(error);
        }
    };

    // Create an item
    async createItem(req: Request, res: Response) {
        const body = req.body;
        try {
            const item = await this.model.create(body);
            res.status(201).send(item);
        } catch (error) {
            res.status(400).send(error);
        }
    };

    // Update an item by id
    async updateItem(req: Request, res: Response) {
        const id = req.params.id;
        if (id) {
          try {
            const body = req.body;
            const update = await this.model.findByIdAndUpdate(id, body, { new: true });
            res.status(200).send(update);
          } catch (error) {
            res.status(400).send(error);
          }
        }        
    };

    // Like an item    
    async handleLike(req: Request, res: Response) : Promise<void> {
      try {
        const itemId = req.params.id;
        const userId = req.body.userId;
        const item = await this.model.findById(itemId);
        if (!item) {
          res.status(404).json({ error: "Item not found" });
          return;
        }
        const index = item.likes.indexOf(userId);
        if (index === -1) {
          // Like the item
          item.likes.push(userId);
        } else {
          // Unlike the item
          item.likes.splice(index, 1);
        }
        item.likesCount = item.likes.length;
        await item.save();
        res.status(200).json(item);
      } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ error: errorMessage });
      }
    }

    // Delete an item by id
    async deleteItem(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const rs = await this.model.findByIdAndDelete(id);
            res.status(200).send("deleted");
        } catch (error) {
            res.status(400).send(error);
        }
    };
}

export default BaseController