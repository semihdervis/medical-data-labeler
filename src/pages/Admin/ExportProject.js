import React from 'react';

function ExportProject({ currentProject }) {
  const handleExport = () => {
    const projectData = {
      id: currentProject.id,
      name: currentProject.name,
      // Add any other project data you want to export
    };

    // Create a blob with the project data
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentProject.name.replace(/\s+/g, '_')}_export.json`;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <section className="section">
      <h3>Export Project</h3>
      <p>Export your project data as a JSON file.</p>
      <p>Project to export: <strong>{currentProject.name}</strong></p>
      <button className='in-page-buttons' onClick={handleExport}>
        Export Project
      </button>
    </section>
  );
}

export default ExportProject;