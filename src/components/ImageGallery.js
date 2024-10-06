// ImageGallery.js
import React, { useState, useEffect } from 'react';
import { storage, ref, getDownloadURL, listAll } from '../firebase/config';

const ImageGallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      // Create a reference to the folder where your images are stored
      const imageListRef = ref(storage, 'images/'); // 'images/' is the folder name in Firebase Storage

      try {
        // Use listAll to get all items in the folder
        const res = await listAll(imageListRef);

        // Fetch URLs for each image
        const imageUrls = await Promise.all(
          res.items.map((itemRef) => getDownloadURL(itemRef))
        );

        setImages(imageUrls);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {images.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`image-${index}`}
            style={{ width: '200px', height: 'auto', margin: '10px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
