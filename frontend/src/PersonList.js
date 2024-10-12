import React from 'react';

function PersonList({ persons, onSelectPerson }) {
  return (
    <div className="sidebar sidebar-person-list">
      <h2>Persons</h2>
      <ul>
        {persons.map((person, index) => (
          <li key={index} onClick={() => onSelectPerson(person)}>
            {person}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PersonList;
