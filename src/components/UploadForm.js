import React, { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState(null);

  const handleChange = (event) => {
    let selected = event.target.files[0];

    console.log(selected);
    console.log(selected.type);
    setFile(selected);
  };

  return (
    <form>
      <input type="file" onChange={handleChange} />
      {file && <p>Selected file: {file.name}</p>}
    </form>
  );
}

export default UploadForm;