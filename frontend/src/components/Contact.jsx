import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { sendContactMessage } from '../api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('IDLE'); // IDLE, SENDING, SUCCESS, ERROR

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('SENDING');
        try {
            await sendContactMessage(formData);
            setStatus('SUCCESS');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            setStatus('ERROR');
        }
    };

    return (
        <section className="py-24 px-6 lg:px-20 bg-primary-bg" id="contact">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-primary-text mb-6">
                        Get In Touch
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        I'm currently looking for new opportunities. Whether you have a question or just want to say hi,
                        my inbox is always open!
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Socials & Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <h3 className="text-xl font-bold text-primary-text mb-4">Contact Info</h3>
                            <a
                                href="mailto:souleimane.ch.ahmed@gmail.com"
                                className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-accent transition-colors"
                            >
                                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-accent">
                                    <Mail size={20} />
                                </div>
                                <span className="font-medium">souleimane.ch.ahmed@gmail.com</span>
                            </a>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <h3 className="text-xl font-bold text-primary-text mb-6">Social Profiles</h3>
                            <div className="flex gap-4">
                                <SocialLink href="https://github.com" icon={<Github size={20} />} label="GitHub" />
                                <SocialLink href="https://linkedin.com" icon={<Linkedin size={20} />} label="LinkedIn" />
                                <SocialLink href="https://twitter.com" icon={<Twitter size={20} />} label="Twitter" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700"
                    >
                        {status === 'SUCCESS' ? (
                            <div className="text-center py-12">
                                <div className="inline-flex p-4 bg-green-100 text-green-600 rounded-full mb-4">
                                    <CheckCircle size={48} />
                                </div>
                                <h3 className="text-2xl font-bold text-primary-text mb-2">Message Sent!</h3>
                                <p className="text-slate-500">Thanks for reaching out. I'll get back to you soon.</p>
                                <button
                                    onClick={() => setStatus('IDLE')}
                                    className="mt-6 text-accent font-semibold hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Your message..."
                                    ></textarea>
                                </div>

                                {status === 'ERROR' && (
                                    <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg text-sm">
                                        <AlertCircle size={16} />
                                        Failed to send message. Please try again.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'SENDING'}
                                    className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {status === 'SENDING' ? 'Sending...' : (
                                        <>
                                            Send Message <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const SocialLink = ({ href, icon, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-accent hover:text-white transition-all duration-300 hover:-translate-y-1"
        aria-label={label}
    >
        {icon}
    </a>
);

export default Contact;
