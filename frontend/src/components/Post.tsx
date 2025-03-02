import React from "react";

interface PostProps {
  title: string;
  content: string;
  sender: string;
}

const Post: React.FC<PostProps> = ({ title, content }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h6 className="card-title">{title}</h6>
        <p className="card-text">{content}</p>
        <button className="btn btn-outline-primary btn-sm">Like ❤️</button>
        <button className="btn btn-outline-secondary btn-sm ms-2">Comment 💬</button>
      </div>
    </div>
  );
};

export default Post;