import React, { useState } from 'react';
import './AdminPage.css'; // Import your CSS file for styling
import ProjectManager from './ProjectManager'; // Component for managing projects
import PatientManager from './PatientManager'; // Component for managing patients
import ImageManager from './ImageManager'; // Component for managing images

const AdminPage = () => {
    const [activeSection, setActiveSection] = useState('projects');

    const renderSection = () => {
        switch (activeSection) {
            case 'projects':
                return <ProjectManager />;
            case 'patients':
                return <PatientManager />;
            case 'images':
                return <ImageManager />;
            default:
                return <ProjectManager />;
        }
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
            </header>
            <div className="admin-body">
                <aside className="admin-sidebar">
                    <ul>
                        <li onClick={() => setActiveSection('projects')}>Manage Projects</li>
                        <li onClick={() => setActiveSection('patients')}>Manage Patients</li>
                        <li onClick={() => setActiveSection('images')}>Manage Images</li>
                    </ul>
                </aside>
                <main className="admin-main">
                    {renderSection()}
                </main>
            </div>
           
        </div>
    );
};

export default AdminPage;
