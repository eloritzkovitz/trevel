import React from "react";
import Post from "./Post";

const PostsList: React.FC = () => {
  const posts = [
    { title: "Trip to Bali 🌴", content: "Had an amazing time in Bali! The beaches were stunning.", sender: "John Doe" },
    { title: "Hiking in the Alps 🏔️", content: "The Alps are breathtaking! Can't wait to go back.", sender: "Jane Smith" },
    // Add more posts here
  ];

  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((post, index) => (
        <Post key={index} title={post.title} content={post.content} sender={post.sender} />
      ))}
    </div>
  );
};

export default PostsList;