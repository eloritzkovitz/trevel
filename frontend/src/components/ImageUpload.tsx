import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTrash } from "@fortawesome/free-solid-svg-icons";

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void;
  resetTrigger?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesSelected, resetTrigger }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    const newFiles = [...selectedFiles, ...files];

    // Generate previews
    const newPreviews = [...previewImages, ...files.map((file) => URL.createObjectURL(file))];

    setSelectedFiles(newFiles);
    setPreviewImages(newPreviews);
    onImagesSelected(newFiles);
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);

    setSelectedFiles(newFiles);
    setPreviewImages(newPreviews);
    onImagesSelected(newFiles);
  };

  // Reset selected files and previews when resetTrigger changes
  useEffect(() => {
    if (resetTrigger) {
      setSelectedFiles([]);
      setPreviewImages([]);      
    }
  }, [resetTrigger]);

  return (
    <div className="d-flex flex-column align-items-start gap-2">
      {/* Custom Upload Button */}
      <label className="btn post-btn d-flex align-items-center gap-2" title="Upload Images">
        <FontAwesomeIcon icon={faImage} />
        <input
          type="file"
          multiple
          accept="image/*"
          className="d-none"
          onChange={handleFileChange}
        />
      </label>

      {/* Preview Selected Images with Remove Option */}
      <div className="d-flex gap-2 flex-wrap">
        {previewImages.map((src, index) => (
          <div key={index} className="position-relative">
            <img
              src={src}
              alt="preview"
              className="rounded border img-thumbnail"
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
              onClick={() => handleRemoveImage(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;