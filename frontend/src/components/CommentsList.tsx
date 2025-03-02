import React from "react";
import Comment from "./Comment";

interface Comment {
  postId: string;
  content: string;
  sender: string;
}

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <div className="mt-3">
      {comments.map((comment, index) => (
        <Comment key={index} postId={comment.postId} content={comment.content} sender={comment.sender} />
      ))}
    </div>
  );
};

export default CommentList;