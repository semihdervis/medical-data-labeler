import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AddProject from './components/AddProject';
import ProjectDetails from './components/ProjectDetails';
import EditProject from './components/EditProject';
import AddPatient from './components/AddPatient';
const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<h1 className="text-2xl font-bold">Welcome to Medical Data Labeler</h1>} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/projects/:id/edit" element={<EditProject />} />
            <Route path="/projects/:id/add-patient" element={<AddPatient />} />
            <Route path="/add-project" element={<AddProject />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;