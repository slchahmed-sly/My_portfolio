import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import 'katex/dist/katex.min.css';

import { fetchProjectBySlug } from '../api';

const ProjectDetail = () => {
    const { slug } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProject = async () => {
            setLoading(true);
            const data = await fetchProjectBySlug(slug);
            setProject(data);
            setLoading(false);
            window.scrollTo(0, 0); // Reset scroll to top
        };
        loadProject();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-primary-text">
                <div className="animate-pulse">Loading...</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-primary-text">
                <h2 className="text-2xl font-bold mb-4">Project not found</h2>
                <Link to="/" className="text-accent hover:underline flex items-center gap-2">
                    <ArrowLeft size={20} /> Back to Home
                </Link>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-primary-bg text-primary-text pb-20">
            {/* Header */}
            <div className="max-w-4xl mx-auto pt-28 px-6">


                <h1 className="text-3xl md:text-5xl font-bold text-primary-text mb-6 leading-tight">
                    {project.title}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-6 border-b border-slate-100 pb-8 mb-8">
                    <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                        {project.category ? project.category.replace('_', ' ') : 'Project'}
                    </span>

                    <div className="flex gap-4">
                        {project.demo_link && (
                            <a
                                href={project.demo_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
                            >
                                Live Demo <ExternalLink size={16} />
                            </a>
                        )}
                        {project.repo_link && (
                            <a
                                href={project.repo_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-2 border-2 border-slate-200 text-slate-600 rounded-full font-semibold hover:border-slate-800 hover:text-slate-900 transition-all text-sm"
                            >
                                Source Code <Github size={16} />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Visuals */}
            <div className="max-w-4xl mx-auto px-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="rounded-xl overflow-hidden shadow-2xl bg-slate-100"
                >
                    <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-auto max-h-[45vh] object-contain bg-slate-200 dark:bg-slate-700"
                    />
                </motion.div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 justify-center mt-8">
                    {project.tags.map(tag => (
                        <span key={tag.id} className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            {tag.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-4xl mx-auto px-6 prose prose-lg prose-slate dark:prose-invert prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-a:text-accent hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-img:rounded-xl">
                <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={atomOneDark}
                                    language={match[1]}
                                    PreTag="div"
                                    className="rounded-lg shadow-lg !bg-slate-900 !p-6 my-6 text-sm"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={`${className} !bg-slate-100 dark:!bg-slate-800 !text-red-500 rounded px-1 py-0.5 font-mono text-sm`} {...props}>
                                    {children}
                                </code>
                            )
                        },
                        img({ node, ...props }) {
                            // Fix for relative media paths from Django/MarkdownX
                            let src = props.src;
                            console.log(src)
                            if (src && !src.startsWith('http')) {
                                // Derive base URL from API_URL (remove /api suffix if present) or default to localhost
                                const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
                                const baseUrl = apiUrl.includes('/api')
                                    ? apiUrl.split('/api')[0]
                                    : apiUrl;

                                // Ensure src starts with / if not present (MarkdownX usually provides /media/...)
                                const cleanSrc = src.startsWith('/') ? src : `/${src}`;
                                src = `${baseUrl}${cleanSrc}`;
                            }

                            return (
                                <img
                                    {...props}
                                    src={src}
                                    className="rounded-xl shadow-lg my-8 max-w-full w-auto h-auto mx-auto block"
                                />
                            );
                        }
                    }}
                >
                    {project.full_description}
                </ReactMarkdown>
            </div>

            {/* Footer */}
            <div className="max-w-4xl mx-auto px-6 mt-20 pt-10 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Link to="/projects" className="group inline-flex items-center gap-3 text-lg font-semibold text-primary-text hover:text-accent transition-colors">
                    Explore more projects <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

        </article>
    );
};

export default ProjectDetail;
