'use client'
import React, { useState } from 'react';

const ImageUploadComponent: React.FC = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 300; // Optimal size for balance between quality and size
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const resizedBase64 = canvas.toDataURL('image/jpeg', 0.75); // Slightly higher quality
          classifyImage(resizedBase64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const classifyImage = async (base64: string) => {
    try {
      const res = await fetch('/api/groq-classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();
      if (res.ok) {
        setResponse(data);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Image Upload and Classification</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {response && <p>Classification: {response}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default ImageUploadComponent;
