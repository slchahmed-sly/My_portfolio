import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fetchProjects } from '../api';
import ProjectCard from './ProjectCard';

const Projects = ({ isArchive = false }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [filteredProjects, setFilteredProjects] = useState([]);

    useEffect(() => {
        const loadProjects = async () => {
            setLoading(true);
            const data = await fetchProjects();
            setProjects(data);
            setLoading(false);
        };
        loadProjects();
    }, []);

    useEffect(() => {
        let result = projects;

        // 1. Filter by category
        if (filter !== 'ALL') {
            result = result.filter(project => project.category === filter);
        }

        // 2. Limit to showcased (e.g., top 6 featured or recent)
        // Ideally backend handles "Featured" flag, but client filtering is OK for small datasets
        const featured = result.filter(p => p.is_featured);
        // If not enough featured, fill with others, or just show all (up to 6)
        // merging logic: prioritise featured, then created_at desc
        // For this component we just want up to 6 items to fit grid nice

        if (!isArchive) {
            setFilteredProjects(result.slice(0, 6));
        } else {
            setFilteredProjects(result);
        }

    }, [projects, filter]);

    const filters = [
        { key: 'ALL', label: 'All' },
        { key: 'FULL_STACK', label: 'Full Stack' },
        { key: 'DATA_SCIENCE', label: 'Data Science' },
        { key: 'SCRIPTS', label: 'Scripts' },
    ];

    return (
        <section className="py-24 px-6 lg:px-20 bg-primary-bg" id="projects">
            <div className="container mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-primary-text mb-6"
                    >
                        Featured Work
                    </motion.h2>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex flex-wrap justify-center gap-2 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-3xl"
                    >
                        {filters.map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`px-4 py-2 text-sm md:px-6 md:py-2 md:text-sm font-semibold rounded-full transition-all duration-300 ${filter === f.key
                                    ? 'bg-white dark:bg-slate-700 text-primary-text shadow-sm'
                                    : 'text-gray-500 hover:text-primary-text'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                >
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            // Skeleton Loading
                            [1, 2, 3].map((n) => (
                                <div key={n} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 h-[400px] animate-pulse">
                                    <div className="h-48 bg-slate-200 dark:bg-slate-700" />
                                    <div className="p-6 space-y-4">
                                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                                        <div className="flex gap-2 pt-4">
                                            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))
                        ) : (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                                <p className="text-lg text-slate-500">No projects found.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>



                {/* Footer Action - Hide if isArchive */}
                {!isArchive && (
                    <div className="text-center">
                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 text-primary-text font-semibold hover:text-accent transition-colors"
                        >
                            View Project Archive <ArrowRight size={20} />
                        </Link>
                    </div>
                )}

            </div>
        </section >
    );
};

export default Projects;
