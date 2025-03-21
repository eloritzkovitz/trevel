import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import postService from "../services/post-service";
import ImageUpload from "./ImageUpload";

interface PostModalProps {  
  onPostCreated: () => void;
}

const CreatePost: React.FC<PostModalProps> = ({ onPostCreated }) => {
  const { user: loggedInUser } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);  

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      
      if (images) {        
        Array.from(images).forEach((image) => {
          formData.append("images", image);
        });
      }

      await postService.createPost(formData);

      // Reset form fields after successful post creation
      setTitle("");
      setContent("");
      setImages(null);

      onPostCreated();      
    } catch (error) {
      console.error("Failed to create post", error);
      setError("Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card panel p-3 mb-4">
      <div className="d-flex align-items-start gap-2">
        {/* Profile Picture */}
        <img
          className="profile-picture-4 rounded-circle"
          src={loggedInUser?.profilePicture || ""}
          alt="Profile"
          style={{ width: "40px", height: "40px", objectFit: "cover" }}
        />

        {/* Post Form */}
        <Form className="flex-grow-1" onSubmit={handleSubmit}>

          {/* Title Input */}
          <Form.Control
            type="text"
            placeholder="Give your post a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-2 rounded-pill"
            style={{ width: "50%" }}
          />

          {/* Content Input */}
          <div className="d-flex align-items-center gap-2">            
            <Form.Control
              as="textarea"
              rows={1}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="flex-grow-1 rounded-pill"
            />

            {/* Post Button */}
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </div>

          {/* Image Upload */}
          <ImageUpload
            onImagesSelected={(files) => setImages(Array.from(files))}
            resetTrigger={!images || images.length === 0}
          />

          {/* Error Message */}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </Form>
      </div>
    </div>
  );
};

export default CreatePost;