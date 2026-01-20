import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import 'katex/dist/katex.min.css';
import { useTranslation } from 'react-i18next';

import { fetchPostBySlug, createComment } from '../api';

const slugify = (text) => {
    if (!text) return '';
    return String(text)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};

const getTextFromChildren = (children) => {
    let text = '';
    React.Children.forEach(children, (child) => {
        if (typeof child === 'string' || typeof child === 'number') {
            text += child;
        } else if (child?.props?.children) {
            text += getTextFromChildren(child.props.children);
        } else if (Array.isArray(child)) {
            text += getTextFromChildren(child);
        }
    });
    return text;
};

const BlogPost = () => {
    const { t, i18n } = useTranslation();
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');

    // Comment State
    const [commentData, setCommentData] = useState({ author_name: '', body: '' });
    const [commentStatus, setCommentStatus] = useState('IDLE');

    useEffect(() => {
        const loadPost = async () => {
            setLoading(true);
            const data = await fetchPostBySlug(slug, i18n.language);
            setPost(data);
            setLoading(false);

            if (data && data.content) {
                // Extract headings for TOC
                // Matches standard Markdown headings with up to 3 leading spaces
                const headingRegex = /^\s{0,3}(#{1,3})\s+(.*)$/;

                const lines = data.content.split(/\r?\n/);
                const extractedHeadings = lines
                    .map(line => {
                        const match = line.match(headingRegex);
                        if (!match) return null; // No match

                        // match[1] is hashes, match[2] is text
                        const level = match[1].length;
                        const text = match[2].trim();
                        const id = slugify(text);
                        return { id, text, level };
                    })
                    .filter(Boolean); // Remove nulls

                setHeadings(extractedHeadings);
            }
        };
        loadPost();
    }, [slug, i18n.language]);

    // Handle Scroll Spy for TOC
    useEffect(() => {
        if (loading || headings.length === 0) return;

        const handleScroll = () => {
            const headingElements = headings.map(({ id }) => document.getElementById(id));

            // Find the heading that is closest to the top of the viewport
            // but not too far down (e.g., within top 20% or passed it)
            let currentActiveId = '';

            for (const element of headingElements) {
                if (!element) continue;

                const rect = element.getBoundingClientRect();

                // If the element is within the top region of the viewport (e.g. top 150px)
                // or we have scrolled past it, it could be the active one.
                // We want the *last* one that satisfies this to be active.
                if (rect.top <= 150) {
                    currentActiveId = element.id;
                } else {
                    // Once we find an element that is further down, we stop, 
                    // because the previous one was the correct "active" one.
                    break;
                }
            }

            // If we are at the very top, maybe no ID is active, or the first one?
            // Let's keep the logic simple: verify we set something
            if (currentActiveId) {
                setActiveId(currentActiveId);
            } else if (headings.length > 0 && window.scrollY < 200) {
                // Optional: highlight first item if near top
                setActiveId(headings[0].id);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, [headings, loading]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setCommentStatus('SENDING');
        try {
            await createComment({ ...commentData, post: post.id });
            setCommentStatus('SUCCESS');
            setCommentData({ author_name: '', body: '' });
        } catch (error) {
            setCommentStatus('ERROR');
        }
    };

    const HeadingRenderer = ({ level, children, ...props }) => {
        const text = getTextFromChildren(children);
        const id = slugify(text);

        // Dynamic tag generation
        const Tag = `h${level}`;

        return <Tag id={id} {...props}>{children}</Tag>;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary-bg text-primary-text">
                <div className="animate-pulse">Loading Article...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-primary-bg text-primary-text">
                <h2 className="text-2xl font-bold mb-4">{t('blog_post.not_found')}</h2>
                <Link to="/blog" className="text-accent hover:underline flex items-center gap-2">
                    <ArrowLeft size={20} /> {t('blog_post.back_writing')}
                </Link>
            </div>
        );
    }

    // Calculate Read Time
    const readTime = Math.ceil(post.content.trim().split(/\s+/).length / 200);

    return (
        <article className="min-h-screen bg-primary-bg text-primary-text pb-20 pt-28">

            {/* Back Link (Top Left) */}
            <div className="container mx-auto max-w-6xl px-6 mb-8">
                <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent font-medium transition-colors">
                    <ArrowLeft size={18} /> {t('blog_post.back_writing')}
                </Link>
            </div>

            {/* Main Content Layout */}
            <div className="container mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-4 gap-12">

                {/* Article Body (Left) */}
                <div className="lg:col-span-3">

                    {/* Post Header (Moved Inside Content Column) */}
                    <div className="mb-12">
                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {readTime} {t('blog.read_time')}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
                            {post.title}
                        </h1>

                        <div className="flex gap-2">
                            {post.tags.map(tag => (
                                <span key={tag.id} className="text-sm font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-32 prose-headings:font-bold prose-a:text-accent hover:prose-a:underline prose-img:rounded-xl prose-img:mx-auto">
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
                                        <code className={`${className} bg-slate-100 dark:bg-slate-800 text-red-500 rounded px-1 py-0.5`} {...props}>
                                            {children}
                                        </code>
                                    )
                                },
                                img({ node, ...props }) {
                                    // Backend URL fix
                                    const src = props.src.startsWith('http') ? props.src : `http://127.0.0.1:8000${props.src}`;
                                    return (
                                        <img
                                            {...props}
                                            src={src}
                                            className="rounded-xl shadow-lg my-8 max-w-full w-auto h-auto mx-auto block"
                                        />
                                    );
                                },
                                // Add IDs to headings for TOC
                                h1: (props) => <HeadingRenderer level={1} {...props} />,
                                h2: (props) => <HeadingRenderer level={2} {...props} />,
                                h3: (props) => <HeadingRenderer level={3} {...props} />
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-20 pt-12 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-2xl font-bold mb-8">{t('blog_post.discussion')}</h3>

                        {/* List */}
                        {post.comments && post.comments.length > 0 ? (
                            <div className="space-y-6 mb-12">
                                {post.comments.map(comment => (
                                    <div key={comment.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-bold text-slate-800 dark:text-slate-200">{comment.author_name}</h4>
                                            <span className="text-xs text-slate-400">
                                                {new Date(comment.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{comment.body}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 mb-8">{t('blog_post.no_comments')}</p>
                        )}

                        {/* Form */}
                        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <h4 className="text-lg font-bold mb-4">{t('blog_post.leave_comment')}</h4>
                            {commentStatus === 'SUCCESS' ? (
                                <div className="text-green-600 bg-green-50 p-4 rounded-lg">
                                    {t('blog_post.comment_submitted')}
                                    <button onClick={() => setCommentStatus('IDLE')} className="block mt-2 text-sm underline text-green-700">{t('blog_post.write_another')}</button>
                                </div>
                            ) : (
                                <form onSubmit={handleCommentSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('contact.name')}</label>
                                        <input
                                            type="text"
                                            required
                                            value={commentData.author_name}
                                            onChange={e => setCommentData({ ...commentData, author_name: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-accent"
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('contact.message')}</label>
                                        <textarea
                                            required
                                            rows="3"
                                            value={commentData.body}
                                            onChange={e => setCommentData({ ...commentData, body: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-accent"
                                            placeholder="Great article..."
                                        ></textarea>
                                    </div>
                                    {commentStatus === 'ERROR' && <p className="text-red-500 text-sm">{t('blog_post.submit_error')}</p>}
                                    <button
                                        type="submit"
                                        disabled={commentStatus === 'SENDING'}
                                        className="px-6 py-2 bg-accent text-white rounded-lg font-bold hover:bg-opacity-90 disabled:opacity-50"
                                    >
                                        {commentStatus === 'SENDING' ? t('blog_post.submitting') : t('blog_post.post_comment')}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar (Right) */}
                <div className="hidden lg:block relative">
                    <div className="sticky top-32 max-h-[calc(100vh-140px)] overflow-y-auto pr-4 custom-scrollbar">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 sticky top-0 bg-primary-bg z-10 py-2">{t('blog_post.toc')}</h4>
                        <nav className="flex flex-col gap-1 border-l py-2 border-slate-200 dark:border-slate-800 relative">
                            {/* Create a separate track for the visual indicator */}

                            {headings.map(heading => (
                                <a
                                    key={`${heading.id}-${heading.text}`}
                                    href={`#${heading.id}`}
                                    className={`pl-4 py-1.5 text-sm transition-colors block truncate relative ${activeId === heading.id
                                        ? 'text-accent font-medium'
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                        }`}
                                    style={{
                                        paddingLeft: heading.level === 3 ? '2rem' : heading.level === 2 ? '1rem' : '1rem',
                                        fontSize: heading.level === 3 ? '0.85rem' : '0.875rem'
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                                        // Wait a bit for scroll to act before updating ID manually if needed
                                    }}
                                >
                                    {activeId === heading.id && (
                                        <motion.div
                                            layoutId="activeToc"
                                            className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent -ml-[1px]"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        />
                                    )}
                                    {heading.text}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>

            </div>
        </article>
    );
};

export default BlogPost;
