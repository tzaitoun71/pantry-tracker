'use client';

import React, { useState, useRef } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, IconButton } from '@mui/material';
import { Check, Close, CloudUpload as CloudUploadIcon, CameraAlt as CameraAltIcon, SwitchCamera as SwitchCameraIcon } from '@mui/icons-material';
import { Camera } from 'react-camera-pro';

interface ImageCaptureProps {
  onImageProcessed: (itemName: string) => void;
  onClose: () => void;
}

interface CameraRef {
  takePhoto: () => string;
  switchCamera: () => void;
  currentDeviceId: string | null;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onImageProcessed, onClose }) => {
  const cameraRef = useRef<CameraRef | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openPreviewModal, setOpenPreviewModal] = useState<boolean>(false);
  const [openCamera, setOpenCamera] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setOpenPreviewModal(true);
    }
  };

  const handleTakePhoto = () => {
    setOpenCamera(true);
  };

  const handleCapturePhoto = () => {
    if (cameraRef.current) {
      const photo = cameraRef.current.takePhoto();
      const byteString = atob(photo.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: 'image/jpeg' });
      const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });
      setSelectedFile(file);
      setPreview(photo);
      setOpenCamera(false);
      setOpenPreviewModal(true);
    }
  };

  const handleSwitchCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.switchCamera();
    }
  };

  const handleConfirm = async () => {
    if (selectedFile) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', 'someUserId'); // Add the user ID here

      const response = await fetch('/api/classify-image', {
        method: 'POST',
        body: formData,
      });

      setLoading(false);

      if (response.ok) {
        const result = await response.json();
        const itemName = result.itemName;
        if (itemName) {
          onImageProcessed(itemName);
          handleClosePreviewModal(); // Close the preview modal
          onClose(); // Close the image preview modal
        } else {
          console.error('Failed to classify image');
        }
      } else {
        console.error('Failed to classify image');
      }
    }
  };

  const handleClosePreviewModal = () => {
    setOpenPreviewModal(false);
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <>
      <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Capture or Upload Image</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </Button>
            <Button
              variant="contained"
              startIcon={<CameraAltIcon />}
              onClick={handleTakePhoto}
            >
              Take a picture
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={onClose}>
            <Close color="error" />
          </IconButton>
        </DialogActions>
      </Dialog>

      <Dialog open={openCamera} onClose={() => setOpenCamera(false)} fullWidth maxWidth="sm">
        <DialogTitle>Take a Picture</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Camera
              ref={cameraRef}
              aspectRatio={16 / 9}
              errorMessages={{
                noCameraAccessible: 'No camera device accessible. Please connect a camera or try a different browser.',
                permissionDenied: 'Permission denied. Please refresh and give camera permission.',
                switchCamera: 'It is not possible to switch camera to different one because there is only one video device accessible.',
                canvas: 'Canvas is not supported.',
              }}
            />
            <Button
              variant="contained"
              startIcon={<SwitchCameraIcon />}
              onClick={handleSwitchCamera}
            >
              Switch Camera
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => setOpenCamera(false)}>
            <Close color="error" />
          </IconButton>
          <IconButton onClick={handleCapturePhoto}>
            <Check color="success" />
          </IconButton>
        </DialogActions>
      </Dialog>

      <Dialog open={openPreviewModal} onClose={handleClosePreviewModal} fullWidth maxWidth="sm">
        <DialogTitle>Preview Image</DialogTitle>
        <DialogContent>
          {preview && <img src={preview} alt="Preview" style={{ width: '100%', marginTop: '10px' }} />}
          {loading && <CircularProgress style={{ display: 'block', margin: '20px auto' }} />}
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleClosePreviewModal}>
            <Close color="error" />
          </IconButton>
          <IconButton onClick={handleConfirm} disabled={!selectedFile || loading}>
            <Check color="success" />
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImageCapture;
