'use client'

import React, { useState } from 'react';

interface ImageCaptureProps {
  onImageProcessed: (itemName: string) => void;
  onClose: () => void;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onImageProcessed, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleConfirm = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', 'someUserId'); // Add the user ID here

      const response = await fetch('/api/classify-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const itemName = result.itemName;
        if (itemName) {
          onImageProcessed(itemName);
        } else {
          console.error('Failed to classify image');
        }
      } else {
        console.error('Failed to classify image');
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {selectedFile && (
        <div>
          <button onClick={handleConfirm}>Confirm</button>
          <button onClick={onClose}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ImageCapture;
