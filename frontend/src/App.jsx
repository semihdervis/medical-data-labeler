import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import DynamicModelUpdateTest from './pages/DynamicModelUpdateTest';
import ProjectsManagamentTest from './pages/ProjectsManagamentTest';
import './App.css'

function App() {
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #dee2e6'
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#007bff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s'
  };

  const linkHoverStyle = {
    backgroundColor: '#e2e6ea'
  };

  return (
    <Router>
      <nav style={navStyle}>
        <Link to="/" style={linkStyle} onMouseEnter={(e) => e.target.style.backgroundColor = linkHoverStyle.backgroundColor} onMouseLeave={(e) => e.target.style.backgroundColor = ''}>Home</Link>
        <Link to="/dynamic" style={linkStyle} onMouseEnter={(e) => e.target.style.backgroundColor = linkHoverStyle.backgroundColor} onMouseLeave={(e) => e.target.style.backgroundColor = ''}>DynamicModelUpdateTest</Link>
        <Link to="/projects" style={linkStyle} onMouseEnter={(e) => e.target.style.backgroundColor = linkHoverStyle.backgroundColor} onMouseLeave={(e) => e.target.style.backgroundColor = ''}>ProjectsManagamentTest</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dynamic" element={<DynamicModelUpdateTest />} />
        <Route path="/projects" element={<ProjectsManagamentTest />} />
      </Routes>
    </Router>
  );
}

export default App;