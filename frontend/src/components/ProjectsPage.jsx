import React, { useEffect } from 'react';
import Projects from './Projects';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const ProjectsPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-primary-bg pt-20">
            {/* We can reuse the Projects component but in "Archive Mode" */}
            <Projects isArchive={true} />
        </div>
    );
};

export default ProjectsPage;
