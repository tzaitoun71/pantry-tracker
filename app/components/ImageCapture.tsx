'use client';

import React, { useRef, useState } from 'react';
import {Camera} from 'react-camera-pro';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

type ImageCaptureProps = {
  onImageProcessed: (itemName: string) => void;
  onClose: () => void;
};

type CameraRef = {
    takePhoto: () => string;
  };
  

const ImageCapture: React.FC<ImageCaptureProps> = ({ onImageProcessed, onClose }) => {
  const camera = useRef<CameraRef | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const captureImage = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      setImage(photo);
    }
  };

  const processImage = async () => {
    if (image) {
      try {
        const response = await axios.post('YOUR_OPENAI_VISION_API_URL', {
          headers: {
            Authorization: `Bearer YOUR_OPENAI_API_KEY`,
            'Content-Type': 'application/json',
          },
          data: {
            image: image,
          },
        });
        const itemName = response.data; // Adjust based on the response structure
        onImageProcessed(itemName);
        onClose();
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Capture and Identify Food</DialogTitle>
      <DialogContent>
        {!image ? (
          <>
            <Camera ref={camera} aspectRatio={16 / 9} />
            <Button onClick={captureImage} variant="contained" sx={{ mt: 2 }}>
              Capture Image
            </Button>
          </>
        ) : (
          <>
            <img src={image} alt="Captured" style={{ width: '100%', maxHeight: '300px' }} />
            <Button onClick={processImage} variant="contained" sx={{ mt: 2 }}>
              Process Image
            </Button>
            <Button onClick={() => setImage(null)} variant="contained" sx={{ mt: 2 }}>
              Retake Image
            </Button>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCapture;
