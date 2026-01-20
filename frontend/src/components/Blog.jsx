import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, Calendar } from 'lucide-react';
import { fetchPosts } from '../api';
import { useTranslation } from 'react-i18next';

const Blog = () => {
    const { t, i18n } = useTranslation();
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('All');
    const [tags, setTags] = useState(['All']);

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            const data = await fetchPosts(i18n.language);
            setPosts(data);
            setFilteredPosts(data);

            // Extract unique tags
            const allTags = new Set(['All']);
            data.forEach(post => {
                post.tags.forEach(tag => allTags.add(tag.name));
            });
            setTags(Array.from(allTags));

            setLoading(false);
        };
        loadPosts();
    }, [i18n.language]);

    useEffect(() => {
        let result = posts;

        // Filter by Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(post =>
                post.title.toLowerCase().includes(lowerTerm) ||
                post.content.toLowerCase().includes(lowerTerm)
            );
        }

        // Filter by Tag
        if (selectedTag !== 'All') {
            result = result.filter(post =>
                post.tags.some(tag => tag.name === selectedTag)
            );
        }

        setFilteredPosts(result);
    }, [searchTerm, selectedTag, posts]);

    // Calculate Read Time (approx 200 words per minute)
    const calculateReadTime = (content) => {
        const words = content.trim().split(/\s+/).length;
        const time = Math.ceil(words / 200);
        return `${time} ${t('blog.read_time')}`;
    };

    return (
        <div className="min-h-screen bg-primary-bg text-primary-text pt-28 pb-20 px-6">
            <div className="container mx-auto max-w-4xl">

                {/* Header */}
                <div className="mb-16 text-center md:text-start">
                    <h1 className="text-4xl md:text-6xl font-bold mb-8">{t('blog.title')}</h1>

                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                            <input
                                type="text"
                                placeholder={t('blog.search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full ps-12 pe-4 py-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-accent outline-none transition-shadow shadow-sm"
                            />
                        </div>

                        {/* Tag Cloud */}
                        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                            {tags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedTag === tag
                                        ? 'bg-accent text-primary-bg'
                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Feed */}
                <div className="space-y-12">
                    {loading ? (
                        <div className="animate-pulse space-y-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-2xl"></div>
                            ))}
                        </div>
                    ) : filteredPosts.length > 0 ? (
                        filteredPosts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative border-b border-zinc-100 dark:border-zinc-800 pb-12 last:border-0"
                            >
                                <div className="flex flex-col gap-3 mb-3">
                                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {calculateReadTime(post.content)}
                                        </span>
                                    </div>

                                    <Link to={`/blog/${post.slug}`} className="block">
                                        <h2 className="text-2xl md:text-3xl font-bold group-hover:text-accent transition-colors">
                                            {post.title}
                                        </h2>
                                    </Link>
                                </div>

                                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4 line-clamp-2 md:line-clamp-3 md:w-3/4">
                                    {/* Strip markdown for excerpt if needed, or just show raw/formatted text */}
                                    {post.content.replace(/[#*`]/g, '').slice(0, 180)}...
                                </p>

                                <div className="flex gap-2 mt-4">
                                    {post.tags.map(tag => (
                                        <span key={tag.id} className="text-xs font-semibold px-2 py-1 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 rounded">
                                            #{tag.name}
                                        </span>
                                    ))}
                                </div>
                            </motion.article>
                        ))
                    ) : (
                        <div className="text-center py-20 text-zinc-400">
                            <p className="text-lg">{t('blog.empty')}</p>
                            <button
                                onClick={() => { setSearchTerm(''); setSelectedTag('All'); }}
                                className="mt-4 text-accent font-medium hover:underline"
                            >
                                {t('blog.clear_filters')}
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Blog;
