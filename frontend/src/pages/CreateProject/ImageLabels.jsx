import React, { useState } from "react";
import removeIcon from "../icons/remove.png";
import addIcon from "../icons/add.png";

function ImageLabels({ imageLabels, setImageLabels }) {
  const [isOptionsVisible, setIsOptionsVisible] = useState(null);
  const [newOption, setNewOption] = useState("");

  const handleAddImageLabel = () => {
    setImageLabels([...imageLabels, { name: "", type: "text", options: [] }]);
  };

  const handleRemoveImageLabel = (indexToRemove) => {
    setImageLabels(imageLabels.filter((_, index) => index !== indexToRemove));
  };

  const handleAddOption = (labelIndex) => {
    const newLabels = [...imageLabels];
    if (newOption) {
      newLabels[labelIndex].options.push(newOption); // Add new option
      setImageLabels(newLabels);
      setNewOption(""); // Reset the new option input
    }
  };

  const handleRemoveOption = (labelIndex, optionIndex) => {
    const newLabels = [...imageLabels];
    newLabels[labelIndex].options = newLabels[labelIndex].options.filter(
      (_, idx) => idx !== optionIndex
    );
    setImageLabels(newLabels);
  };

  const handleToggleOptions = (index) => {
    setIsOptionsVisible(isOptionsVisible === index ? null : index); // Toggle options visibility
  };

  return (
    <section className="bg-white rounded-lg p-5 shadow-md w-full max-w-3xl">
      <h3 className="text-primary text-lg font-bold mb-4">
        Image-Related Labels
      </h3>
      {imageLabels.map((label, index) => (
        <div key={index} className="flex flex-col gap-4 mb-6">
          <div className="flex gap-4 items-start">
            <input
              type="text"
              value={label.name}
              placeholder="Enter image label"
              onChange={(e) => {
                const newLabels = [...imageLabels];
                newLabels[index].name = e.target.value;
                setImageLabels(newLabels);
              }}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={label.type}
              onChange={(e) => {
                const newLabels = [...imageLabels];
                newLabels[index].type = e.target.value;
                if (e.target.value !== "dropdown") {
                  newLabels[index].options = [];
                }
                setImageLabels(newLabels);
              }}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="dropdown">Dropdown</option>
              <option value="slider">Slider</option>
            </select>
            <button
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
              onClick={() => handleRemoveImageLabel(index)}
            >
              <img src={removeIcon} alt="Remove" className="w-5 h-5" />
            </button>
          </div>

          {/* Options section toggle */}
          {label.type === "dropdown" && (
            <div>
              <button
                className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition"
                onClick={() => handleToggleOptions(index)}
              >
                Options
              </button>
              {isOptionsVisible === index && (
                <div className="absolute bg-gray-50 border border-gray-300 p-4 rounded-md shadow-lg z-50 mt-2">
                  <h4 className="text-primary text-md font-semibold mb-4">
                    Options
                  </h4>
                  {label.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="flex items-center gap-2 mb-2"
                    >
                      <input
                        type="text"
                        value={option}
                        placeholder="Enter option"
                        onChange={(e) => {
                          const newLabels = [...imageLabels];
                          newLabels[index].options[optionIndex] =
                            e.target.value;
                          setImageLabels(newLabels);
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        className="bg-red-600 text-white py-1 px-2 rounded-md hover:bg-red-700 transition"
                        onClick={() => handleRemoveOption(index, optionIndex)}
                      >
                        <img
                          src={removeIcon}
                          alt="Remove Option"
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newOption}
                      placeholder="New Option"
                      onChange={(e) => setNewOption(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition"
                      onClick={() => handleAddOption(index)}
                    >
                      <img src={addIcon} alt="Add Option" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      <button
        className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition"
        onClick={handleAddImageLabel}
      >
        Add Image Label
      </button>
    </section>
  );
}

export default ImageLabels;
