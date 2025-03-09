import React from "react";
import { Button } from "react-bootstrap";
import CommentsList from "./CommentsList";

interface PostProps {
  title: string;
  content: string;
  senderName: string;
  senderImage: string;    
  isOwner: boolean;
  onEdit: () => void;  
}

const Post: React.FC<PostProps> = ({ title, content, senderName, senderImage, isOwner, onEdit }) => { 

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex align-items-center mb-2">
          <img src={senderImage} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} />
          <h5 className="card-text mb-0"><small className="text-muted">{senderName}</small></h5>
        </div>
        <h6 className="card-title">{title}</h6>
        <p className="card-text">{content}</p>
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