import React from "react";
import { Button } from "react-bootstrap";
import CommentsList from "./CommentsList";

interface PostProps {
  title: string;
  content: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  isOwner: boolean;
  onEdit: () => void;  
}

const Post: React.FC<PostProps> = ({ title, content, sender, isOwner, onEdit }) => { 
  
  const senderName = `${sender.firstName} ${sender.lastName}`;

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h6 className="card-title">{title}</h6>
        <p className="card-text">{content}</p>        
        <p className="card-text"><small className="text-muted">Posted by {senderName}</small></p>
        {isOwner && (
          <Button variant="primary" onClick={onEdit}>
            Edit
          </Button>
        )}
        <button className="btn btn-outline-primary btn-sm">Like ❤️</button>
        <button className="btn btn-outline-secondary btn-sm ms-2">Comment 💬</button>
      </div>
      {/* <div className="card-body">
        <CommentsList comments={comments} />
      </div> */}
    </div>
  );
};

export default Post;