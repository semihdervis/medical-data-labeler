import React, { useState, useRef, useEffect } from "react";
import removeIcon from "../icons/remove.png";
import addIcon from "../icons/add.png";

function PersonLabels({ personLabels, setPersonLabels }) {
  const [isOptionsVisible, setIsOptionsVisible] = useState(null);
  const [newOption, setNewOption] = useState("");
  const dropdownRefs = useRef([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefs.current &&
        !dropdownRefs.current.some((ref) => ref && ref.contains(event.target))
      ) {
        setIsOptionsVisible(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddPersonLabel = () => {
    setPersonLabels([...personLabels, { labelQuestion: "", labelType: "text", labelOptions: [] }]);
  };

  const handleRemovePersonLabel = (indexToRemove) => {
    setPersonLabels(personLabels.filter((_, index) => index !== indexToRemove));
  };

  const handleAddOption = (labelIndex) => {
    if (newOption) {
      const updatedLabels = [...personLabels];
      updatedLabels[labelIndex].labelOptions.push(newOption);
      setPersonLabels(updatedLabels);
      setNewOption("");
    }
  };

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
              value={label.labelQuestion}
              placeholder="Enter person label"
              onChange={(e) => {
                const newLabels = [...personLabels];
                newLabels[index].labelQuestion = e.target.value;
                setPersonLabels(newLabels);
              }}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2 items-center">
              <select
                value={label.labelType}
                onChange={(e) => {
                  const newLabels = [...personLabels];
                  newLabels[index].labelType = e.target.value;
                  if (e.target.value !== "dropdown") {
                    newLabels[index].labelOptions = [];
                  }
                  setPersonLabels(newLabels);
                }}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="string">String</option>
                <option value="int">Integer</option>
                <option value="dropdown">Dropdown</option>
                <option value="slider">Slider</option>
              </select>

              {/* Options section toggle */}
              {label.labelType === "dropdown" && (
                <div ref={(el) => (dropdownRefs.current[index] = el)}>
                  <button
                    className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition"
                    onClick={() =>
                      setIsOptionsVisible(isOptionsVisible === index ? null : index)
                    }
                  >
                    Options
                  </button>
                  {isOptionsVisible === index && (
                    <div className="absolute bg-gray-50 border border-gray-300 p-4 rounded-md shadow-lg z-50 mt-2">
                      <h4 className="text-primary text-md font-semibold mb-4">
                        Options
                      </h4>
                      {label.labelOptions.map((option, optionIndex) => (
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
                              newLabels[index].labelOptions[optionIndex] =
                                e.target.value;
                              setPersonLabels(newLabels);
                            }}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <button
                            className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition"
                            onClick={() => {
                              const newLabels = [...personLabels];
                              newLabels[index].labelOptions = newLabels[index].labelOptions.filter(
                                (_, idx) => idx !== optionIndex
                              );
                              setPersonLabels(newLabels);
                            }}
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
                          className="bg-primary text-white p-2 rounded-md hover:bg-secondary transition"
                          onClick={() => handleAddOption(index)}
                        >
                          <img src={addIcon} alt="Add Option" className="w-4 h-4" />
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
