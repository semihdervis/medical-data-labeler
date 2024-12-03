import React, { useState } from "react";

function ExportProject({ currentProject }) {
  const [exportFormat, setExportFormat] = useState("json");

  const handleExport = () => {
    const projectData = {
      id: currentProject.id,
      name: currentProject.name,
      // Add any other project data you want to export
    };

    let blob;
    let fileExtension;

    if (exportFormat === "json") {
      blob = new Blob([JSON.stringify(projectData, null, 2)], {
        type: "application/json",
      });
      fileExtension = "json";
    } else if (exportFormat === "csv") {
      const csvData = `id,name\n${projectData.id},${projectData.name}`;
      blob = new Blob([csvData], { type: "text/csv" });
      fileExtension = "csv";
    }

    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentProject.name.replace(
      /\s+/g,
      "_"
    )}_export.${fileExtension}`;

    // Trigger the download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-white rounded-lg p-5 shadow-md w-full max-w-md">
      <h3 className="text-indigo-600 text-lg font-bold mb-4">Export Project</h3>
      <p className="text-gray-700 mb-3">
        Export your project data as a JSON or CSV file.
      </p>
      <p className="text-gray-700 mb-5">
        Project to export:{" "}
        <strong className="font-semibold">{currentProject.name}</strong>
      </p>
      <label className="block mb-5">
        <span className="text-indigo-600 font-semibold mb-2 block">
          Select format:
        </span>
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
        </select>
      </label>
      <button
        className="bg-indigo-700 text-white py-2 px-4 rounded-md hover:bg-indigo-800 transition"
        onClick={handleExport}
      >
        Export Project
      </button>
    </section>
  );
}

export default ExportProject;
