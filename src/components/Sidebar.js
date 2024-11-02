import React from 'react';

function Sidebar({ role }) {
  return (
    <div className="sidebar">
      <h3>{role === 'doctor' ? 'Doctor Dashboard' : 'Admin Dashboard'}</h3>
      <ul>
        <li>Projects</li>
        {role === 'admin' && <li>Manage Projects</li>}
      </ul>
    </div>
  );
}

export default Sidebar;
