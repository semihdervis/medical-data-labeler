// App.js
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import DynamicModelUpdateTest from './pages/DynamicModelUpdateTest';
import ProjectsManagamentTest from './pages/ProjectsManagamentTest';
import Admin from './pages/AdminPage';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <nav className="nav-style">
        <Link to="/" className="link-style">Home</Link>
        <Link to="/dynamic" className="link-style">DynamicModelUpdateTest</Link>
        <Link to="/projects" className="link-style">ProjectsManagamentTest</Link>
        <Link to="/admin" className="link-style">Shrimp'sPlayground</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dynamic" element={<DynamicModelUpdateTest />} />
        <Route path="/projects" element={<ProjectsManagamentTest />} />
        <Route path="/admin" element={<Admin />} />

      </Routes>
    </Router>
  );
}

export default App;
