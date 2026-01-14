import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

function App() {
  return (
    <div className="font-sans text-primary-text bg-primary-bg min-h-screen selection:bg-accent selection:text-white">
      <Navbar />
      <Hero />
    </div>
  );
}

export default App;