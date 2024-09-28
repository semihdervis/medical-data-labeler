import React, { useState } from 'react';
import Annotation from 'react-image-annotation';
import {
  PointSelector,
} from 'react-image-annotation/lib/selectors';
import './App.css';

function App() {
  const [annotations, setAnnotations] = useState([]);
  const [annotation, setAnnotation] = useState({});

  const onChange = (newAnnotation) => {
    setAnnotation(newAnnotation);
  };

  // Add a date context to the annotation data on submission
  const onSubmit = (newAnnotation) => {
    const { geometry, data } = newAnnotation;

    // Get current date and time
    const currentDate = new Date().toLocaleString();

    // Create a new annotation with the date context
    setAnnotations([...annotations, {
      geometry,
      data: {
        ...data,
        id: Math.random(),
        date: currentDate, // Add date to annotation data
      }
    }]);

    // Clear the current annotation
    setAnnotation({});
  };

  return (
    <div className="App" style={{ display: 'flex' }}>
      <Annotation
        src={`${process.env.PUBLIC_URL}/sad.png`}
        alt="Annotatable Image"
        annotations={annotations}
        type={PointSelector.TYPE}
        value={annotation}
        onChange={onChange}
        onSubmit={onSubmit}
        style={{ width: '800px', height: 'auto' }}
      />
      <div style={{ marginLeft: '20px', maxWidth: '300px' }}>
        <h3>Surgery Log</h3>
        {annotations.map((annotation, index) => (
          <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <p><strong>Date:</strong> {annotation.data.date}</p>
            <p><strong>Data:</strong> {JSON.stringify(annotation.data.text)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;