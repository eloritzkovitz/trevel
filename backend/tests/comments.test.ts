import request from "supertest";
import initApp from "../src/server";
import mongoose from "mongoose";
import commentsModel from "../src/models/Comment";
import postModel from "../src/models/Post";
import userModel, { IUser } from "../src/models/User";
import { Express } from "express";
import testComments from "./testComments.json";
import path from "path";

var app: Express;

type User = IUser & { token?: string };
const testUser: User = {
  firstName: "User1",
  lastName: "Test",
  email: "test@user.com",
  password: "testpassword",
};

let postId = "";
let commentId = "";

const oldImagePath = path.join(__dirname, "img", "post-test-image.jpg");
const newImagePath = path.join(__dirname, "img", "post-test-image-new.jpg");
let createResponse: any = null;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.PORT = "4000";
  console.log(`beforeAll - NODE_ENV: ${process.env.NODE_ENV}, PORT: ${process.env.PORT}`);

  app = await initApp();
  await commentsModel.deleteMany();
  await postModel.deleteMany();
  await userModel.deleteMany();
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  testUser.token = res.body.accessToken;
  testUser._id = res.body._id;
  expect(testUser.token).toBeDefined();

  // Create a post to associate comments with
  const postRes = await request(app).post("/posts")
    .set({ authorization: "JWT " + testUser.token })
    .send({
      title: "Test Post",
      content: "Test Content",
      sender: testUser._id,
    });
  postId = postRes.body._id;
});

beforeEach(async () => {
  await commentsModel.deleteMany();
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

describe("Comments Tests", () => {
  test("Comments test get all", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Comment", async () => {
    const response = await request(app).post("/comments")
          .set({ authorization: "JWT " + testUser.token })          
          .field("postId", postId)
          .field("content", "This is a comment") 
    expect(response.statusCode).toBe(201);
    expect(response.body.postId).toBe(postId);
    expect(response.body.content).toBe(testComments[0].content);
    expect(response.body.sender).toBe(testUser._id);
    commentId = response.body._id;
    createResponse = response;
  });

  test("Test Create Comment with Missing Post ID", async () => {
    const response = await request(app).post("/comments")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        content: testComments[0].content,
        sender: testUser._id,
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Post Id required");
  });

  test("Test Create Comment with Invalid Post ID", async () => {
    const response = await request(app).post("/comments")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        content: testComments[0].content,
        postId: "invalidPostId",
        sender: testUser._id,
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid Post Id");
  });

  test("Test Create Comment with Non-Existent Post ID", async () => {
    const nonExistentPostId = new mongoose.Types.ObjectId().toString();
    const response = await request(app).post("/comments")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        content: testComments[0].content,
        postId: nonExistentPostId,
        sender: testUser._id,
      });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Post not found");
  });

  test("Test get comment by sender", async () => {
    // Create a comment first
    await request(app).post("/comments")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        content: testComments[0].content,
        postId: postId,
        sender: testUser._id,
      });

    const response = await request(app).get("/comments?sender=" + testUser._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].postId).toBe(postId);
    expect(response.body[0].content).toBe(testComments[0].content);
    expect(response.body[0].sender).toBe(testUser._id);
  });  

  // Test get comment by post ID
  test("Get comments by post ID", async () => {
    // Create a comment first
    await request(app).post("/comments")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        content: testComments[0].content,
        postId: postId,
        sender: testUser._id,
      });

    const response = await request(app).get("/comments/post/" + postId);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].postId).toBe(postId);
    expect(response.body[0].content).toBe(testComments[0].content);
    expect(response.body[0].sender).toBe(testUser._id);
  });

  // Test get comment by post ID fail
  test("Get comments by post ID", async () => {
    const response = await request(app).get("/comments/post/invalidPostId");
    expect(response.statusCode).toBe(500);    
  });

  test("Test Update Comment", async () => {
    // Create a comment first
    createResponse = await request(app).post("/comments/")    
          .set({ authorization: "JWT " + testUser.token })
          .attach("images", oldImagePath)          
          .field("postId", postId)
          .field("content", "Test Content")
    commentId = createResponse.body._id;

    const response = await request(app).put("/comments/" + commentId)
           .set({ authorization: "JWT " + testUser.token })
           .attach("images", newImagePath)         
           .field("content", "Updated Content")     
           .field("deletedImages", JSON.stringify([createResponse.body.images[0]]));
    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe("Updated Content");

    const response2 = await request(app).delete("/comments/" + commentId)
      .set({ authorization: "JWT " + testUser.token });
    expect(response2.statusCode).toBe(200);
  });

  // Test update comment fail
  test("Test Update Comment fail", async () => {
    const response = await request(app).put("/comments/" + "60f7b3b3b1b3f3b3b3b3b3b3")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        content: "Updated Content",
      });
    expect(response.statusCode).toBe(404);
    
    const response2 = await request(app).put("/comments/invalidCommentId")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        content: "Updated Content",
      });
    expect(response2.statusCode).toBe(500);    
  });  

  test("Test Delete Comment", async () => {
    // Create a comment first
    const createRes = await request(app).post("/comments")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        content: testComments[0].content,
        postId: postId,
        sender: testUser._id,
      });
    commentId = createRes.body._id;

    const response = await request(app).delete("/comments/" + commentId)
      .set({ authorization: "JWT " + testUser.token });
    expect(response.statusCode).toBe(200);

    const getResponse = await request(app).get("/comments/" + commentId);
    expect(getResponse.statusCode).toBe(404);
  });
});