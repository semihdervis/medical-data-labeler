import React, { useState, useRef, useEffect } from 'react'
import removeIcon from '../icons/remove.png'
import addIcon from '../icons/add.png'

function ImageLabels ({ imageLabels, setImageLabels }) {
  const [isOptionsVisible, setIsOptionsVisible] = useState(null)
  const [newOption, setNewOption] = useState('')
  const dropdownRefs = useRef([])

  const handleAddImageLabel = () => {
    setImageLabels([
      ...imageLabels,
      { labelQuestion: '', labelType: 'text', labelOptions: [] }
    ])
  }

  const handleRemoveImageLabel = indexToRemove => {
    setImageLabels(imageLabels.filter((_, index) => index !== indexToRemove))
  }

  const handleAddOption = labelIndex => {
    if (newOption) {
      const updatedLabels = [...imageLabels]
      updatedLabels[labelIndex].labelOptions.push(newOption)
      setImageLabels(updatedLabels)
      setNewOption('')
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        isOptionsVisible !== null &&
        dropdownRefs.current[isOptionsVisible] &&
        !dropdownRefs.current[isOptionsVisible].contains(event.target)
      ) {
        setIsOptionsVisible(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOptionsVisible])

  return (
    <section className='bg-white rounded-lg p-5 shadow-md w-full max-w-xl'>
      <h3 className='text-primary text-lg font-bold mb-4'>
        Image-Related Labels
      </h3>
      {imageLabels.map((label, index) => (
        <div key={index} className='flex flex-col gap-4 mb-6'>
          <div className='flex gap-4 items-start'>
            <input
              type='text'
              value={label.labelQuestion}
              placeholder='Enter image label'
              onChange={e => {
                const newLabels = [...imageLabels]
                newLabels[index].labelQuestion = e.target.value
                setImageLabels(newLabels)
              }}
              className='flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            />
            <select
              value={label.labelType}
              onChange={e => {
                const newLabels = [...imageLabels]
                newLabels[index].labelType = e.target.value
                if (e.target.value !== 'dropdown') {
                  newLabels[index].labelOptions = []
                }
                setImageLabels(newLabels)
              }}
              className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            >
              <option value='string'>String</option>
              <option value='int'>Integer</option>
              <option value='dropdown'>Dropdown</option>
              <option value='slider'>Slider</option>
            </select>
            {label.labelType === 'dropdown' && (
              <button
                className='bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition'
                onClick={() =>
                  setIsOptionsVisible(isOptionsVisible === index ? null : index)
                }
              >
                Options
              </button>
            )}
            <button
              className='bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition'
              onClick={() => handleRemoveImageLabel(index)}
            >
              <img src={removeIcon} alt='Remove' className='w-5 h-5' />
            </button>
          </div>

          {/* Options section toggle */}
          {label.labelType === 'dropdown' && isOptionsVisible === index && (
            <div
              ref={el => (dropdownRefs.current[index] = el)}
              className='absolute right-56 top-80 bg-gray-50 border border-gray-300 p-4 rounded-md shadow-lg z-50 mt-2'
            >
              <h4 className='text-primary text-md font-semibold mb-4'>
                Options
              </h4>
              {label.labelOptions.map((option, optionIndex) => (
                <div key={optionIndex} className='flex items-center gap-2 mb-2'>
                  <input
                    type='text'
                    value={option}
                    placeholder='Enter option'
                    onChange={e => {
                      const newLabels = [...imageLabels]
                      newLabels[index].labelOptions[optionIndex] =
                        e.target.value
                      setImageLabels(newLabels)
                    }}
                    className='flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                  />
                  <button
                    className='bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition'
                    onClick={() => {
                      const newLabels = [...imageLabels]
                      newLabels[index].labelOptions = newLabels[
                        index
                      ].labelOptions.filter((_, idx) => idx !== optionIndex)
                      setImageLabels(newLabels)
                    }}
                  >
                    <img
                      src={removeIcon}
                      alt='Remove Option'
                      className='w-4 h-4'
                    />
                  </button>
                </div>
              ))}
              <div className='flex items-center gap-2'>
                <input
                  type='text'
                  value={newOption}
                  placeholder='New Option'
                  onChange={e => setNewOption(e.target.value)}
                  className='flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                />
                <button
                  className='bg-primary text-white p-2 rounded-md hover:bg-secondary transition'
                  onClick={() => handleAddOption(index)}
                >
                  <img src={addIcon} alt='Add Option' className='w-4 h-4' />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      <button
        className='bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition w-full mt-3'
        onClick={handleAddImageLabel}
      >
        Add Image Label
      </button>
    </section>
  )
}

export default ImageLabels
