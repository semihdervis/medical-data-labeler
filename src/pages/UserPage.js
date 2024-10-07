import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storage, ref, listAll, getDownloadURL } from '../firebase/config';
import './UserPage.css'; // Import your CSS

const UserPage = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [hoveredFolder, setHoveredFolder] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [folderImages, setFolderImages] = useState([]);
  const [hoveredImages, setHoveredImages] = useState([]);

  useEffect(() => {
    // Fetch all subfolders in the 'dataset' directory
    const fetchFolders = async () => {
      const datasetRef = ref(storage, 'dataset/');
      try {
        const res = await listAll(datasetRef);
        setFolders(res.prefixes); // Set sub-folder references in state
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    fetchFolders();
  }, []);

  const handleFolderClick = async (folderRef) => {
    setSelectedFolder(folderRef.name);
    setCurrentImageIndex(0); // Reset image index
    try {
      // Fetch all images within the selected folder
      const res = await listAll(folderRef);
      const imageRefs = res.items;
      const imageUrls = await Promise.all(
        imageRefs.map((imageRef) => getDownloadURL(imageRef))
      );
      setFolderImages(imageUrls);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleFolderHover = async (folderRef) => {
    setHoveredFolder(folderRef.name);
    try {
      // Fetch all images within the hovered folder
      const res = await listAll(folderRef);
      const imageRefs = res.items;
      const imageUrls = await Promise.all(
        imageRefs.map((imageRef) => getDownloadURL(imageRef))
      );
      setHoveredImages(imageUrls);
    } catch (error) {
      console.error("Error fetching hover images:", error);
    }
  };

  const nextImage = () => {
    if (currentImageIndex < folderImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const previousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div className="user-page">
      <div className='sidebar-box'>
        <div className="sidebar">
          <h2>Folders</h2>
          <ul>
            {folders.map((folderRef) => (
              <li
                key={folderRef.name}
                onMouseEnter={() => handleFolderHover(folderRef)}
                onClick={() => handleFolderClick(folderRef)}
              >
                {folderRef.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="preview-sidebar">
          {hoveredFolder && (
            <div>
              <h3>{hoveredFolder}'s Image Previews</h3>
              <div className="image-previews">
                {hoveredImages.map((url, index) => (
                  <img key={index} src={url} alt={`preview-${index}`} className="preview-image" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="content-area">
        {selectedFolder && (
          <>
            <h2>{selectedFolder}'s Images</h2>
            <div className="image-container">
              <img
                src={folderImages[currentImageIndex]}
                alt={`folder-image-${currentImageIndex}`}
                className="patient-image"
              />
              <div className="navigation-buttons">
                <button onClick={previousImage} disabled={currentImageIndex === 0}>
                  Previous
                </button>
                <button onClick={nextImage} disabled={currentImageIndex === folderImages.length - 1}>
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <div className='rightmost-sidebar'>
        <Link to="/">Go to Home Page</Link>
      </div>
    </div>
  );
};

export default UserPage;
