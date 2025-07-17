import React, { useCallback, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-bootstrap";
import { getImageUrl } from "../utils/imageUrl";

interface ImageEditorProps {
  initialExistingImages: string[];
  initialNewImages: File[];
  onImagesUpdated: (updatedImages: {
    existingImages: string[];
    newImages: File[];
    deletedImages: string[];
  }) => void;
}

const MAX_IMAGES = 6;

const ImageEditor: React.FC<ImageEditorProps> = ({
  initialExistingImages,
  initialNewImages,
  onImagesUpdated,
}) => {
  const [existingImages, setExistingImages] = useState<string[]>(
    initialExistingImages
  );
  const [newImages, setNewImages] = useState<File[]>(initialNewImages);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Use useCallback to prevent unnecessary re-renders
  const memoizedOnImagesUpdated = useCallback(onImagesUpdated, []);

  // Avoid unnecessary updates with JSON comparison
  useEffect(() => {
    const updatedData = { existingImages, newImages, deletedImages };

    // Prevent infinite re-renders by checking if data actually changed
    if (
      JSON.stringify(updatedData) !== localStorage.getItem("lastImagesState")
    ) {
      memoizedOnImagesUpdated(updatedData);
      localStorage.setItem("lastImagesState", JSON.stringify(updatedData));
    }
  }, [existingImages, newImages, deletedImages, memoizedOnImagesUpdated]);

  // Handle adding new images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalImages =
        existingImages.length + newImages.length + files.length;

      // Check if the total number of images exceeds the limit
      if (totalImages > MAX_IMAGES) {
        setError(`You can only upload up to ${MAX_IMAGES} images.`);
        return;
      }

      setError(null);
      setNewImages([...newImages, ...Array.from(e.target.files)]);
    }
  };

  // Handle removing an existing image
  const handleRemoveExistingImage = (image: string) => {
    setExistingImages(existingImages.filter((img) => img !== image));
    setDeletedImages([...deletedImages, image]); // Mark for deletion
  };

  // Handle removing a new image
  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="image-editor">
      {/* Display Existing Images */}
      <Form.Group className="mt-3">
        <Form.Label>Existing Images</Form.Label>
        <div className="d-flex flex-wrap">
          {existingImages.map((img, index) => (
            <div key={index} className="position-relative me-2">
              <img
                src={getImageUrl(img, "image")}
                alt="Existing"
                className="img-thumbnail"
                style={{ width: 100, height: 100 }}
              />
              <FontAwesomeIcon
                icon={faTrash}
                className="text-danger position-absolute top-0 end-0"
                style={{
                  cursor: "pointer",
                  background: "white",
                  borderRadius: "50%",
                }}
                onClick={() => handleRemoveExistingImage(img)}
              />
            </div>
          ))}
        </div>
      </Form.Group>

      {/* Display New Images */}
      <Form.Group className="mt-3">
        <Form.Label>New Images</Form.Label>
        <div className="d-flex flex-wrap">
          {newImages.map((img, index) => (
            <div key={index} className="position-relative me-2">
              <img
                src={URL.createObjectURL(img)}
                alt="New"
                className="img-thumbnail"
                style={{ width: 100, height: 100 }}
              />
              <FontAwesomeIcon
                icon={faTrash}
                className="text-danger position-absolute top-0 end-0"
                style={{
                  cursor: "pointer",
                  background: "white",
                  borderRadius: "50%",
                }}
                onClick={() => handleRemoveNewImage(index)}
              />
            </div>
          ))}
        </div>
        <Form.Control
          type="file"
          multiple
          onChange={handleImageChange}
          className="mt-2"
        />
      </Form.Group>

      {/* Error Message */}
      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  );
};

export default ImageEditor;
