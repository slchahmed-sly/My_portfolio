import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={() => navigate(`/projects/${project.slug}`)}
            className="group relative bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full cursor-pointer"
        >
            {/* Top Half - Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 z-10 transition-colors duration-300" />
                <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Bottom Half - The Intel */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-xl font-bold text-primary-text mb-2 group-hover:text-accent transition-colors">
                    {project.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.slice(0, 3).map(tag => ( // Limit tags for cleanliness
                        <span key={tag.id} className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300">
                            {tag.name}
                        </span>
                    ))}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
                    {project.short_description}
                </p>

                {/* Spacer to push footer down */}
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-700 flex items-center justify-between">

                    {/* Date / Type */}
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                        {project.category ? project.category.replace('_', ' ') : 'Project'}
                    </span>

                    {/* Actions */}
                    <div className="flex gap-3">
                        {project.repo_link && (
                            <a
                                href={project.repo_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-primary-text transition-colors p-1"
                                title="View Code"
                                onClick={(e) => e.stopPropagation()} // Prevent card click
                            >
                                <Github size={18} />
                            </a>
                        )}
                        {project.demo_link && (
                            <a
                                href={project.demo_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-accent transition-colors p-1"
                                title="Live Demo"
                                onClick={(e) => e.stopPropagation()} // Prevent card click
                            >
                                <ExternalLink size={18} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;

