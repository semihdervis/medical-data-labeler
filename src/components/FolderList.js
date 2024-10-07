// FolderList.js
import React, { useState, useEffect } from 'react';
import { storage, ref, listAll } from '../firebase/config';

const FolderList = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderImages, setFolderImages] = useState([]);

  useEffect(() => {
    // Fetch all folders within the 'dataset' directory
    const fetchFolders = async () => {
      const datasetRef = ref(storage, 'dataset/');
      try {
        const res = await listAll(datasetRef);
        // Filter only directories and set them in state
        const folderRefs = res.prefixes; // `prefixes` contains references to sub-folders
        setFolders(folderRefs);
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    fetchFolders();
  }, []);

  // Handle folder click to fetch and display its contents
  const handleFolderClick = async (folderRef) => {
    setSelectedFolder(folderRef.name);
    try {
      const res = await listAll(folderRef);
      const imageRefs = res.items; // `items` contains references to files within the folder
      setFolderImages(imageRefs);
    } catch (error) {
      console.error("Error fetching folder contents:", error);
    }
  };

  return (
    <div>
      <h2>Folders in Dataset</h2>
      <ul>
        {folders.map((folderRef, index) => (
          <li key={index} onClick={() => handleFolderClick(folderRef)}>
            {folderRef.name}
          </li>
        ))}
      </ul>

      {selectedFolder && (
        <div>
          <h3>Contents of {selectedFolder}</h3>
          <ul>
            {folderImages.map((imageRef, index) => (
              <li key={index}>{imageRef.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FolderList;
