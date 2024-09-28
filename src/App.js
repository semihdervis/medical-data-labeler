import React, { useState } from 'react';
import Annotation from 'react-image-annotation';
import './App.css';
import {
  PointSelector,
} from 'react-image-annotation/lib/selectors'

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
        type={PointSelector.TYPE}
        value={annotation}
        onChange={onChange}
        onSubmit={onSubmit}
        style={{ width: '800px', height: 'auto' }} // Set the desired width and height
      />
    </div>
  );
}

export default App;
