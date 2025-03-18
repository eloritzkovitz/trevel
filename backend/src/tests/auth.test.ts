import { Express } from "express";
import request from "supertest";
import path from "path";
import initApp from "../server";
import mongoose from "mongoose";
import userModel, { IUser } from "../models/User";
import postModel from "../models/Post";
import { generateToken, verifyRefreshToken } from "../utils/tokenService";
import { OAuth2Client } from 'google-auth-library';

var app: Express;

const baseUrl = "/auth";

type User = IUser & {
  accessToken?: string,
  refreshToken?: string
};

const testUser: User = {
  firstName: "User1",
  lastName: "Test",
  email: "test@user.com",
  password: "testpassword",
}

const testUser2: User = {
  firstName: "User2",
  lastName: "Test",
  email: "test2@user.com",
  password: "testpassword123",
}

describe("Auth Tests", () => {
  
  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.PORT = "4000";
    console.log(`beforeAll - NODE_ENV: ${process.env.NODE_ENV}, PORT: ${process.env.PORT}`);

    app = await initApp();
    await userModel.deleteMany();
    await postModel.deleteMany();
  });

  afterAll((done) => {
    console.log("afterAll");
    mongoose.connection.close();
    done();
  });
    
  // Test register
  test("Auth test register", async () => {
    const response = await request(app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).toBe(200);
  });

  // Test register fail
  test("Auth test register fail", async () => {
    const response = await request(app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).not.toBe(200);
  });

  // Test register fail
  test("Auth test register fail", async () => {
    const response = await request(app).post(baseUrl + "/register").send({
      email: "sdsdfsd",
    });
    expect(response.statusCode).not.toBe(200);
    const response2 = await request(app).post(baseUrl + "/register").send({
      email: "",
      password: "sdfsd",
    });
    expect(response2.statusCode).not.toBe(200);
  });

  // Test login
  test("Auth test login", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(200);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(response.body._id).toBeDefined();
    testUser.accessToken = accessToken;
    testUser.refreshToken = refreshToken;
    testUser._id = response.body._id;
  });

  // Test login tokens
  test("Check tokens are not the same", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;

    expect(accessToken).not.toBe(testUser.accessToken);
    expect(refreshToken).not.toBe(testUser.refreshToken);
  });  

  // Test login fail
  test("Auth test login fail", async () => {
    const response = await request(app).post(baseUrl + "/login").send({
      email: testUser.email,
      password: "sdfsd",
    });
    expect(response.statusCode).not.toBe(200);

    const response2 = await request(app).post(baseUrl + "/login").send({
      email: "fakemail",
      password: "sdfsd",
    });
    expect(response2.statusCode).not.toBe(200);
  });  
  
  // Test generate token fail
  test("Test generate token fail", async () => {
    const originalSecret = process.env.TOKEN_SECRET;
    delete process.env.TOKEN_SECRET;

    const result = generateToken("mockUserId");
    expect(result).toBeNull();

    const response = await request(app).post(baseUrl + "/login").send(testUser);    
    expect(response.statusCode).toBe(500);
    expect(response.text).toBe("Server Error");

    process.env.TOKEN_SECRET = originalSecret;
  });

  // Test me
  test("Auth test me", async () => {
    const response = await request(app).post("/posts").send({
      title: "Test Post",
      content: "Test Content",
      sender: testUser._id,
    });
    expect(response.statusCode).not.toBe(201);
    const response2 = await request(app).post("/posts").set(
      { authorization: "JWT " + testUser.accessToken }
    ).send({
      title: "Test Post",
      content: "Test Content",
      sender: testUser._id,
    });
    expect(response2.statusCode).toBe(201);
  });  

  // Test refresh token
  test("Test refresh token", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;
  });
  
  // Test refresh token fail
  test("Test invalid refresh token", async () => {    
    const invalidRefreshToken = "invalidToken";

    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: invalidRefreshToken,
    });
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("fail");
  });

  // Test missing refresh token
  test("Test Missing Refresh Token", async () => {
    const refreshRes = await request(app).post("/auth/refresh").send({});
    expect(refreshRes.statusCode).toBe(400);
    expect(refreshRes.text).toBe("Refresh token is required");
  });
    
  // Test double use refresh token
  test("Double use refresh token", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response.statusCode).toBe(200);
    const refreshTokenNew = response.body.refreshToken;

    const response2 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response2.statusCode).not.toBe(200);

    const response3 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: refreshTokenNew,
    });
    expect(response3.statusCode).not.toBe(200);
  });  

  // Test get user
  test("Test get user", async () => {
    const response = await request(app).get(baseUrl + "/user/" + testUser._id)
      .set("Authorization", `Bearer ${testUser.accessToken}`);    
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(testUser._id);    
  });

  // Test get user fail
  test("Test get user fail", async () => {
    // Test get user with invalid token
    const response = await request(app).get(baseUrl + "/user/" + testUser._id)
      .set("Authorization", `Bearer invalidtoken`);
    expect(response.statusCode).not.toBe(200);

    // Test user does not exist
    const nonExistentUserId = "60d21b4667d0d8992e610c85";
    const response2 = await request(app).get(baseUrl + "/user/" + nonExistentUserId)
      .set("Authorization", `Bearer ${testUser.accessToken}`);
    expect(response2.statusCode).toBe(404);

    // Test cannot fetch user 
    const response3 = await request(app).get(baseUrl + "/user/" + 'invalidId')
      .set("Authorization", `Bearer ${testUser.accessToken}`);
    expect(response3.statusCode).toBe(500);    
  });
  
  // Test update user
  test("Test update user", async () => {
    const imagePath = path.join(__dirname, "img", "test-image.png");

    const response = await request(app)
      .put(baseUrl + "/user/" + testUser._id)
      .set("Authorization", `Bearer ${testUser.accessToken}`)
      .field("firstName", "User1")
      .field("lastName", "Test")
      .field("password", "testpassword")
      .field("headline", "New Headline")
      .field("bio", "New Bio")
      .field("location", "New Location")
      .field("website", "website.com")
      .attach("profilePicture", imagePath);

    expect(response.statusCode).toBe(200);
    expect(response.body.profilePicture).toBeDefined();
  });

  // Test update user with removed image
  test("Test update user 2", async () => {    

    const response = await request(app)
      .put(baseUrl + "/user/" + testUser._id)
      .set("Authorization", `Bearer ${testUser.accessToken}`)      
      .field("headline", "New Headline")
      .field("bio", "New Bio")
      .field("location", "New Location")
      .field("website", "website.com")   
      .field("profilePicture", "null");  

    expect(response.statusCode).toBe(200);    
    if (response.body.profilePicture === "null") {
       expect(response.body.profilePicture).toBe(`${process.env.BASE_URL}/uploads/default-profile.png`);      
    }   
  });

  // Test update user fail with invalid token
  test("Test update user fail", async () => {    
    const response = await request(app)
      .put(baseUrl + "/user/" + testUser._id)
      .set("Authorization", `Bearer invalidtoken`)      
      .field("headline", "New Headline")
      .field("bio", "New Bio")
      .field("location", "New Location")
      .field("website", "website.com");
    expect(response.statusCode).not.toBe(200);
    
    // Test update invalid user
    const nonExistentUserId = "60d21b4667d0d8992e610c85";
    const response2 = await request(app).put(baseUrl + "/user/" + nonExistentUserId)
    .set("Authorization", `Bearer ${testUser.accessToken}`)    
    .send({
      firstName: "Updated Name",      
    });

    expect(response2.statusCode).toBe(404);
    expect(response2.body.message).toBe("User not found");        
  });  

  // Test logout
  test("Test logout", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(200);
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;

    const response2 = await request(app).post(baseUrl + "/logout").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response2.statusCode).toBe(200);

    const response3 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response3.statusCode).not.toBe(200);
  });

  // Test logout fail
  test("Test logout fail", async () => {
    const response = await request(app).post(baseUrl + "/logout").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response.statusCode).not.toBe(200);
  });
  
  // Test logout without refresh token
  test("Test Logout without Refresh Token", async () => {
    const response = await request(app).post(baseUrl + "/logout").send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Refresh token is required");
  });  

  // Test refresh token with invalid token
  test("Test Refresh Token with Invalid Token", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: "invalidtoken",
    });   

    expect(response.statusCode).not.toBe(201);    
  });

  // Test refresh token with missing user
  test("Test Refresh Token with Missing User", async () => {
    const invalidRefreshToken = "someInvalidToken";
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: invalidRefreshToken,
    });
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("fail");
  });  

  test("Create post when TOKEN_SECRET is missing from server", async () => {
    const originalSecret = process.env.TOKEN_SECRET;
    delete process.env.TOKEN_SECRET;

    const testPost = {
      title: "Test Post",
      content: "Test Content",
      sender: testUser._id
    }

    const response = await request(app)
      .post("/posts")
      .set({ authorization: `JWT ${testUser.accessToken}` })
      .send(testPost);
    expect(response.statusCode).toBe(500);
    expect(response.text).toBe("Server Error");

    process.env.TOKEN_SECRET = originalSecret;
  });

  // Test missing TOKEN_SECRET
  test("Test Missing TOKEN_SECRET", async () => {
    const originalTokenSecret = process.env.TOKEN_SECRET;
    delete process.env.TOKEN_SECRET;

    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });    

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("Token secret is missing");

    process.env.TOKEN_SECRET = originalTokenSecret;
  });

  // Test timeout token
  jest.setTimeout(10000);
  test("Test timeout token ", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(200);
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const response2 = await request(app).post("/posts").set(
      { authorization: "JWT " + testUser.accessToken }
    ).send({
      title: "Test Post",
      content: "Test Content",
      sender: testUser._id,
    });
    expect(response2.statusCode).not.toBe(201);

    const response3 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response3.statusCode).toBe(200);
    testUser.accessToken = response3.body.accessToken;

    const response4 = await request(app).post("/posts").set(
      { authorization: "JWT " + testUser.accessToken }
    ).send({
      title: "Test Post",
      content: "Test Content",
      sender: testUser._id,
    });
    expect(response4.statusCode).toBe(201);
  });
});

jest.mock('google-auth-library', () => {
  const mockVerifyIdToken = jest.fn().mockResolvedValue({
    getPayload: jest.fn().mockReturnValue({
      sub: "12345678901234567890",
      email: "testuser@gmail.com",
      given_name: "Test",
      family_name: "User",
      picture: "https://example.com/photo.jpg",
      iss: "accounts.google.com",
      aud: process.env.GOOGLE_CLIENT_ID,
      exp: Math.floor(Date.now() / 1000) + 3600,
    }),
  });

  return {
    OAuth2Client: jest.fn(() => ({
      verifyIdToken: mockVerifyIdToken,
    })),
  };
});

// Test Google Sign-In
test("Test Google Sign-In", async () => {
  const mockIdToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXVkIjoiMzExOTkwNDIzMjAzLWhzdHVidG9xaXQza2M3ZXNibTBuOXZjNmhyYmkzbTdkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTIzNDU2Nzg5MDEyMzQ1Njc4OTAiLCJlbWFpbCI6InRlc3R1c2VyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiVGVzdCBVc2VyIiwicGljdHVyZSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IlRlc3QiLCJmYW1pbHlfbmFtZSI6IlVzZXIiLCJpYXQiOjE2MTY1ODk0ODMsImV4cCI6MTYxNjU5MzA4M30.C-VzIn8EgawWDrBvhVZ1fKsCPbJOjfi-RGAXCjKyahk";

  const response = await request(app)
    .post(baseUrl + "/google")
    .send({ idToken: mockIdToken }); 

  expect(response.statusCode).toBe(200);
  expect(response.body.accessToken).toBeDefined();
  expect(response.body.refreshToken).toBeDefined();
  expect(response.body._id).toBeDefined();
});

jest.mock('google-auth-library', () => {
  const mOAuth2Client = {
    verifyIdToken: jest.fn().mockResolvedValue({
      getPayload: jest.fn().mockReturnValue(null),
    }),
  };
  return { OAuth2Client: jest.fn(() => mOAuth2Client) };
});

// Test Google Sign-In with invalid token
test("Test Google Sign-In", async () => {
  const response = await request(app).post(baseUrl + "/google").send({
    idToken: "invalidToken",
  });

  expect(response.statusCode).toBe(400);
  expect(response.text).toBe("Invalid Google ID token");
});