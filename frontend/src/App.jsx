import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import LabelingInterface from "./pages/LabelingInterface";
import AdminProjectPage from "./pages/Edit/AdminProjectPage";
import CreateProject from "./pages/CreateProject";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="/label" element={<LabelingInterface />} />
      <Route path="/edit" element={<AdminProjectPage />} />
      <Route path="/create" element={<CreateProject />} />

    </Routes>
  );
};

export default App;
