import React, { useState, useEffect, useRef } from "react";
import removeIcon from "../icons/remove.png";
import addIcon from "../icons/add.png";

function PersonLabels({ personLabels, setPersonLabels }) {
  const [isOptionsVisible, setIsOptionsVisible] = useState(null);
  const [newOption, setNewOption] = useState("");
  const dropdownRefs = useRef([]);

  const handleAddPersonLabel = () => {
    setPersonLabels([...personLabels, { name: "", type: "text", options: [] }]);
  };

  const handleRemovePersonLabel = (indexToRemove) => {
    setPersonLabels(personLabels.filter((_, index) => index !== indexToRemove));
  };

  const handleAddOption = (labelIndex) => {
    const newLabels = [...personLabels];
    if (newOption) {
      newLabels[labelIndex].options.push(newOption);
      setPersonLabels(newLabels);
      setNewOption("");
    }
  };

  const handleRemoveOption = (labelIndex, optionIndex) => {
    const newLabels = [...personLabels];
    newLabels[labelIndex].options = newLabels[labelIndex].options.filter(
      (_, idx) => idx !== optionIndex
    );
    setPersonLabels(newLabels);
  };

  const handleToggleOptions = (index) => {
    setIsOptionsVisible(isOptionsVisible === index ? null : index);
  };

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOptionsVisible !== null &&
        dropdownRefs.current[isOptionsVisible] &&
        !dropdownRefs.current[isOptionsVisible].contains(event.target)
      ) {
        setIsOptionsVisible(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOptionsVisible]);

  return (
    <section className="bg-white rounded-lg p-5 shadow-md w-full max-w-xl">
      <h3 className="text-primary text-lg font-bold mb-4">
        Person-Related Labels
      </h3>
      {personLabels.map((label, index) => (
        <div key={index} className="flex flex-col gap-4 mb-6">
          <div className="flex gap-4 items-start">
            <input
              type="text"
              value={label.name}
              placeholder="Enter person label"
              onChange={(e) => {
                const newLabels = [...personLabels];
                newLabels[index].name = e.target.value;
                setPersonLabels(newLabels);
              }}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2 items-center">
              <select
                value={label.type}
                onChange={(e) => {
                  const newLabels = [...personLabels];
                  newLabels[index].type = e.target.value;
                  if (e.target.value !== "dropdown") {
                    newLabels[index].options = [];
                  }
                  setPersonLabels(newLabels);
                }}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="dropdown">Dropdown</option>
                <option value="slider">Slider</option>
              </select>

              {label.type === "dropdown" && (
                <div className="relative">
                  <button
                    className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition"
                    onClick={() => handleToggleOptions(index)}
                  >
                    Options
                  </button>
                  {isOptionsVisible === index && (
                    <div
                      ref={(el) => (dropdownRefs.current[index] = el)}
                      className="absolute right-0 bg-gray-50 border border-gray-300 p-4 rounded-md shadow-lg z-50 mt-2"
                      style={{ minWidth: "200px" }}
                    >
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
                              const newLabels = [...personLabels];
                              newLabels[index].options[optionIndex] =
                                e.target.value;
                              setPersonLabels(newLabels);
                            }}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <button
                            className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition"
                            onClick={() =>
                              handleRemoveOption(index, optionIndex)
                            }
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
                          className="bg-primary px-4 py-2 rounded-md hover:bg-secondary transition"
                          onClick={() => handleAddOption(index)}
                        >
                          <img
                            src={addIcon}
                            alt="Add Option"
                            className="w-4 h-4"
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition"
                onClick={() => handleRemovePersonLabel(index)}
              >
                <img src={removeIcon} alt="Remove" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition w-full mt-3"
        onClick={handleAddPersonLabel}
      >
        Add Person Label
      </button>
    </section>
  );
}

export default PersonLabels;
