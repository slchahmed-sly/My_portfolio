import React from 'react';
import Hero from './Hero';
import Bio from './Bio';
import Projects from './Projects';
import Skills from './Skills';
import Contact from './Contact';

const Home = () => {
    return (
        <main>
            <Hero />
            <Bio />
            <Skills />
            <Projects />
            <Contact />
        </main>
    );
};

export default Home;
