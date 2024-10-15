// src/components/PersonList.js
import React from 'react';

const PersonList = ({ persons, setSelectedPerson }) => {
  return (
    <div className="sidebar sidebar-person-list">
      <h2>Persons</h2>
      <ul>
        {persons.map((person, index) => (
          <li key={index} onClick={() => setSelectedPerson(person)}>
            {person}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonList;
