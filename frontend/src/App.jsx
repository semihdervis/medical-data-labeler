import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import LabelingInterface from "./pages/LabelingInterface";
import AdminProjectPage from "./pages/EditProject/EditProject";
import CreateProject from "./pages/CreateProject/CreateProject";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<ProtectedRoute element={AdminDashboard} allowedRoles={['admin']} />} />
      <Route path="/doctor" element={<ProtectedRoute element={DoctorDashboard} allowedRoles={['doctor']} />} />
      <Route path="/label/:projectId" element={<ProtectedRoute element={LabelingInterface} allowedRoles={['admin', 'doctor']} />} /> {/* Updated route */}
      <Route path="/edit/:id" element={<ProtectedRoute element={AdminProjectPage} allowedRoles={['admin']} />} />
      <Route path="/create" element={<ProtectedRoute element={CreateProject} allowedRoles={['admin']} />} />
    </Routes>
  );
};

export default App;