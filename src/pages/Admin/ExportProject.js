import React, { useState } from 'react';

function ExportProject({ currentProject }) {
  const [exportFormat, setExportFormat] = useState('json');

  const handleExport = () => {
    const projectData = {
      id: currentProject.id,
      name: currentProject.name,
      // Add any other project data you want to export
    };

    let blob;
    let fileExtension;

    if (exportFormat === 'json') {
      blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
      fileExtension = 'json';
    } else if (exportFormat === 'csv') {
      const csvData = `id,name\n${projectData.id},${projectData.name}`;
      blob = new Blob([csvData], { type: 'text/csv' });
      fileExtension = 'csv';
    }

    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentProject.name.replace(/\s+/g, '_')}_export.${fileExtension}`;
    
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
      <p>Export your project data as a JSON or CSV file.</p>
      <p>Project to export: <strong>{currentProject.name}</strong></p>
      <label className="export-format-label">
        <span>Select format:</span>
        <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
        </select>
      </label>
      <button className='in-page-buttons' onClick={handleExport}>
        Export Project
      </button>
    </section>
  );
}

export default ExportProject;