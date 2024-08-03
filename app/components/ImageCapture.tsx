import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase';

type ImageCaptureProps = {
  onImageProcessed: (itemName: string) => void;
  onClose: () => void;
};

const ImageCapture: React.FC<ImageCaptureProps> = ({ onImageProcessed, onClose }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleCapture = ({ target }: any) => {
    const file = target.files[0];
    setImageFile(file);
  };

  const handleConfirm = async () => {
    if (imageFile) {
      const storageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(storageRef);

      console.log('Image URL:', url); // Log the image URL

      const classifyResponse = await fetch('/api/classify-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: url }),
      });

      if (!classifyResponse.ok) {
        console.error('Failed to classify image');
        return;
      }

      const result = await classifyResponse.json();
      console.log('Classification result:', result); // Log the classification result

      onImageProcessed(result.itemName);
      onClose();
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Capture Image</DialogTitle>
      <DialogContent>
        <input accept="image/*" type="file" onChange={handleCapture} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} disabled={!imageFile}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCapture;
