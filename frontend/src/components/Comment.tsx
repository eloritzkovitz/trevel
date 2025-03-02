import React from "react";

interface CommentProps {
  postId: string;
  content: string;
  sender: string;
}

const Comment: React.FC<CommentProps> = ({ postId, content, sender }) => {
  return (
    <div className="card mb-2">
      <div className="card-body">
        <h6 className="card-subtitle mb-2 text-muted">{sender}</h6>
        <p className="card-text">{content}</p>
      </div>
    </div>
  );
};

export default Comment;