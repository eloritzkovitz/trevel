import React from "react";
import CommentsList from "./CommentsList";

interface PostProps {
  title: string;
  content: string;
  sender: string;
}

const Post: React.FC<PostProps> = ({ title, content, sender }) => {
  const comments = [
    { postId: "1", sender: "Alice", content: "Great post!" },
    { postId: "2", sender: "Bob", content: "Thanks for sharing!" },
    // Add more comments here
  ];

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h6 className="card-title">{title}</h6>
        <p className="card-text">{content}</p>
        <p className="card-text"><small className="text-muted">Posted by {sender}</small></p>
        <button className="btn btn-outline-primary btn-sm">Like ❤️</button>
        <button className="btn btn-outline-secondary btn-sm ms-2">Comment 💬</button>
      </div>
      <div className="card-body">
        <CommentsList comments={comments} />
      </div>
    </div>
  );
};

export default Post;