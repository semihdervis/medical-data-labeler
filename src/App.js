import React, { useState } from 'react';
import Annotation from 'react-image-annotation';
import './App.css';

function App() {
  const [annotations, setAnnotations] = useState([]);
  const [annotation, setAnnotation] = useState({});

  const onChange = (newAnnotation) => {
    setAnnotation(newAnnotation);
  };

  const onSubmit = (newAnnotation) => {
    const { geometry, data } = newAnnotation;

    setAnnotations([...annotations, {
      geometry,
      data: {
        ...data,
        id: Math.random(),
      }
    }]);

    setAnnotation({});
  };

  return (
    <div className="App">
      <Annotation
        src={`${process.env.PUBLIC_URL}/sad.png`}
        alt="Annotatable Image"
        annotations={annotations}
        type={annotation.type}
        value={annotation}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default App;
