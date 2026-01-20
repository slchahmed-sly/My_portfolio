import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fetchProjects } from '../api';
import ProjectCard from './ProjectCard';
import { useTranslation } from 'react-i18next';

const Projects = ({ isArchive = false }) => {
    const { t, i18n } = useTranslation();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('FULL_STACK');
    const [filteredProjects, setFilteredProjects] = useState([]);

    useEffect(() => {
        const loadProjects = async () => {
            setLoading(true);
            const data = await fetchProjects(i18n.language);
            setProjects(data);
            setLoading(false);
        };
        loadProjects();
    }, [i18n.language]);

    useEffect(() => {
        let result = [];

        if (isArchive) {
            // Archive Mode: Show All, Filter by Category
            result = projects.filter(project => project.category === filter);
        } else {
            // Home Mode:
            // 1. Get pool of featured projects (Top 3 Latest Featured)
            const featuredPool = projects
                .filter(p => p.is_featured)
                .sort((a, b) => new Date(b.created_at || b.id) - new Date(a.created_at || a.id)) // Ensure sorted by newest
                .slice(0, 3);

            // 2. Filter this Top 3 pool by the selected category tab
            result = featuredPool.filter(project => project.category === filter);
        }

        setFilteredProjects(result);

    }, [projects, filter, isArchive]);

    const filters = [
        // { key: 'ALL', label: t('works.filters.all') }, // Removed as requested
        { key: 'FULL_STACK', label: t('works.filters.full_stack') },
        { key: 'DATA_SCIENCE', label: t('works.filters.data_science') },
        { key: 'SCRIPTS', label: t('works.filters.scripts') },
    ];

    return (
        <section className="py-24 px-6 lg:px-20 bg-primary-bg" id="projects">
            <div className="container mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "0px 0px -150px 0px" }}
                        className="text-3xl md:text-5xl font-bold text-primary-text mb-6"
                    >
                        {t('works.title')}
                    </motion.h2>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "0px 0px -150px 0px" }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex flex-wrap justify-center gap-2 bg-gray-100 dark:bg-zinc-900 p-1.5 rounded-3xl"
                    >
                        {filters.map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`px-4 py-2 text-sm md:px-6 md:py-2 md:text-sm font-semibold rounded-full transition-all duration-300 ${filter === f.key
                                    ? 'bg-white dark:bg-zinc-800 text-primary-text shadow-sm'
                                    : 'text-gray-500 hover:text-primary-text'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* Grid */}
                <div className="min-h-[400px]"> {/* Min height to prevent collapse during transition */}
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                            >
                                {/* Skeleton Loading */}
                                {[1, 2, 3].map((n) => (
                                    <div key={n} className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-800 h-[400px] animate-pulse">
                                        <div className="h-48 bg-zinc-200 dark:bg-zinc-800" />
                                        <div className="p-6 space-y-4">
                                            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                                            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                                            <div className="flex gap-2 pt-4">
                                                <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                                                <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key={filter} // Key by filter to trigger exit/enter on change
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                            >
                                {filteredProjects.length > 0 ? (
                                    filteredProjects.map((project) => (
                                        <ProjectCard key={project.id} project={project} />
                                    ))
                                ) : (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                                        <p className="text-lg text-zinc-500">{t('works.empty')}</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>



                {/* Footer Action - Hide if isArchive */}
                {!isArchive && (
                    <div className="text-center">
                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 text-primary-text font-semibold hover:text-accent transition-colors"
                        >
                            {t('works.view_archive')} <ArrowRight size={20} />
                        </Link>
                    </div>
                )}

            </div>
        </section >
    );
};

export default Projects;
