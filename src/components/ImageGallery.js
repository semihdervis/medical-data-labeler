// ImageGallery.js
import React, { useState, useEffect } from 'react';
import { storage, ref, getDownloadURL } from '../firebase/config';

const ImageGallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      // Create a reference to the folder where your images are stored
      const imageListRef = ref(storage, 'images/'); // 'images/' is the folder name in Firebase Storage

      try {
        // Add image references as needed
        const imageUrls = [];
        const fileRefs = ['cat.png', 'dog.png']; // Example file names
        for (const fileName of fileRefs) {
          const imageRef = ref(storage, `images/${fileName}`);
          const url = await getDownloadURL(imageRef);
          imageUrls.push(url);
        }
        
        setImages(imageUrls);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      {images.map((url, index) => (
        <img key={index} src={url} alt={`image-${index}`} style={{ width: '200px', height: 'auto', margin: '10px' }} />
      ))}
    </div>
  );
};

export default ImageGallery;
