import React, { useEffect } from 'react';
import './i18n';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProjectsPage from './components/ProjectsPage';
import ProjectDetail from './components/ProjectDetail';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';

// Helper for Hash Scrolling
const ScrollToAnchor = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return null;
};

// Wrapper to conditionally render Navbar or handle layout changes if needed
const Layout = () => {
  return (
    <div className="font-sans text-primary-text bg-primary-bg min-h-screen selection:bg-accent selection:text-white">
      <ScrollToAnchor />
      <Navbar /> {/* Navbar stays global for now, or can be moved inside Home if specific to landing */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;