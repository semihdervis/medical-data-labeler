import React from 'react';

function RemoveCurrentProject({ currentProject, onRemove }) {
  const handleConfirmRemove = () => {
    onRemove(currentProject.id); // Calls the parent function to remove the project
  };

  return (
    <section className="section">
      <h3>Remove Current Project</h3>
      <p>Are you sure you want to remove the project <strong>{currentProject.name}</strong>?</p>
      <button onClick={handleConfirmRemove} className="confirm-remove-button">
        Confirm Remove
      </button>
    </section>
  );
}

export default RemoveCurrentProject;
