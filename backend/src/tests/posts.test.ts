import request from "supertest";
import path from "path";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/Post";
import { Express } from "express";
import userModel, { IUser } from "../models/User";
import { create } from "domain";

var app: Express;

type User = IUser & { token?: string };
const testUser: User = {
  firstName: "User1",
  lastName: "Test",
  email: "test@user.com",
  password: "testpassword",  
};

const testUser2: User = {
  firstName: "User2",
  lastName: "Test",
  email: "test2@user.com",
  password: "fakepassword",  
};

const oldImagePath = path.join(__dirname, "img", "post-test-image.jpg");
const newImagePath = path.join(__dirname, "img", "post-test-image-new.jpg");
let createResponse: any = null;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.PORT = "4000";
  console.log(`beforeAll - NODE_ENV: ${process.env.NODE_ENV}, PORT: ${process.env.PORT}`);
  
  app = await initApp();
  await userModel.deleteMany();
  await postModel.deleteMany();  
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);  
  testUser.token = res.body.accessToken;
  testUser._id = res.body._id;  
  expect(testUser.token).toBeDefined();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

let postId = "";
describe("Posts Tests", () => {
  // Test get all posts
  test("Posts test get all", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  // Test create post  
  test("Test Create Post", async () => {     
    const response = await request(app).post("/posts")
      .set({ authorization: "JWT " + testUser.token }) 
      .attach("images", oldImagePath)
      .field("title", "Test Post")
      .field("content", "Test Content")         
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
    expect(response.body.sender).toBe(testUser._id);
    postId = response.body._id;
    createResponse = response;
  });

  // Test create post fail
  test("Test Create Post fail", async () => {
    const response = await request(app).post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        content: "Test Content 2",
      });
    expect(response.statusCode).toBe(400);
  });

  // Test file upload with invalid file type
  test("Test file upload with invalid file type", async () => {
    const invalidFilePath = path.join(__dirname, "img", "invalid-file.txt");
  
    const response = await request(app)
      .post("/posts")
      .set("authorization", "JWT " + testUser.token)
      .attach("images", invalidFilePath)
      .field("title", "Test Post")
      .field("content", "Test Content")      
  
    expect(response.statusCode).toBe(500);    
  });

  // Test get post by sender
  test("Test get post by sender", async () => {
    const response = await request(app).get("/posts?sender=" + testUser._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Test Post");
    expect(response.body[0].content).toBe("Test Content");
  });

  // Test get all posts with empty string as sender query parameter
  test("Test get all posts with empty string as sender query parameter", async () => {
    const response = await request(app).get("/posts?sender=");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  }); 

  // Test get post by id
  test("Test get post by id", async () => {
    const response = await request(app).get("/posts/" + postId);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
  });

  // Test get post by id #2
  test("Test Create Post 2", async () => {
    const response = await request(app).post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "Test Post 2",
        content: "Test Content 2",
        sender: testUser._id,
      });
    expect(response.statusCode).toBe(201);
  });

  // Test get all posts
  test("Posts test get all 2", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  // Test like and unlike a post
  test("Test like and unlike a post", async () => {
    // Create a post
    const createResponse = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "Post to Like",
        content: "Content for like test",
        sender: testUser._id,
      });
    expect(createResponse.statusCode).toBe(201);
    const postId = createResponse.body._id;

    // Like the post
    const likeResponse = await request(app)
    .post(`/posts/${postId}/like`)
    .set("Authorization", `Bearer ${testUser.token}`)
    .send({ userId: testUser._id });
    expect(likeResponse.statusCode).toBe(200);
    expect(likeResponse.body.likes).toContain(testUser._id);
    expect(likeResponse.body.likesCount).toBe(1);

    // Unlike the post
    const unlikeResponse = await request(app)
    .post(`/posts/${postId}/like`)
    .set("Authorization", `Bearer ${testUser.token}`)
    .send({ userId: testUser._id });
    expect(unlikeResponse.statusCode).toBe(200);
    expect(unlikeResponse.body.likes).not.toContain(testUser._id);
    expect(unlikeResponse.body.likesCount).toBe(0);
  });

  // Test like post fail
  test("Test like post fail", async () => {
    const postId = "60f7b3b3b1b3f3b3b3b3b3b3";   
    
    const response = await request(app)
    .post(`/posts/${postId}/like`)
    .set("Authorization", `Bearer ${testUser.token}`)
    .send({ userId: testUser._id });
    expect(response.statusCode).toBe(404);

    const response2 = await request(app)
    .post(`/posts/invalidPostId/like`)
    .set("Authorization", `Bearer ${testUser.token}`)
    .send({ userId: testUser._id });
    expect(response2.statusCode).toBe(500);
  });

  // Test update post
  test("Test Update Post", async () => {  
    const response = await request(app).put("/posts/" + postId)    
      .set({ authorization: "JWT " + testUser.token })
      .attach("images", newImagePath)
      .field("title", "Test Post Updated")
      .field("content", "Test Content Updated")     
      .field("deletedImages", JSON.stringify([createResponse.body.images[0]]));
      
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Test Post Updated");
    expect(response.body.content).toBe("Test Content Updated");
  });

  // Test update post fail
  test("Test Update Post fail", async () => {
    const fakePostId = "60f7b3b3b1b3f3b3b3b3b3b3";
    const response = await request(app).put("/posts/" + fakePostId)
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "Test Post Updated",
        content: "Test Content Updated",        
      }); 
    expect(response.statusCode).toBe(404);

    const response2 = await request(app).put("/posts/invalidPostId")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "Test Post Updated",
        content: "Test Content Updated",
      }); 
    expect(response2.statusCode).toBe(500);
  });

  // Test delete post
  test("Test Delete Post", async () => {
    const response = await request(app).delete("/posts/" + postId)
      .set({ authorization: "JWT " + testUser.token });
    expect(response.statusCode).toBe(200);
    const response2 = await request(app).get("/posts/" + postId);
    expect(response2.statusCode).toBe(404);
  }); 
});