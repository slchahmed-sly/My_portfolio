import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            return savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
        }
        return false;
    });

    React.useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleTheme = () => setIsDark(!isDark);

    const navLinks = [
        { name: t('navbar.home'), href: '/' },
        { name: t('navbar.about'), href: '/#about' },
        { name: t('navbar.works'), href: '/#projects' },
        { name: t('navbar.blog'), href: '/blog' },
        { name: t('navbar.contact'), href: '/#contact' },
    ];

    return (
        <motion.nav
            initial={{ y: -100, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="fixed top-6 left-1/2 w-[90%] max-w-5xl bg-primary-bg rounded-full shadow-lg z-50 px-6 py-3 flex items-center justify-between"
        >
            {/* Logo */}
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-brand-start to-brand-end bg-clip-text text-transparent">
                Souleimane
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
                <ul className="flex items-center gap-6">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            {link.href.startsWith('/') ? (
                                <Link
                                    to={link.href}
                                    className="text-primary-text hover:text-gray-500 hover:bg-gray-100 px-3 py-1 rounded-full transition-colors duration-200 text-sm font-medium"
                                >
                                    {link.name}
                                </Link>
                            ) : (
                                <a
                                    href={link.href}
                                    className="text-primary-text hover:text-gray-500 hover:bg-gray-100 px-3 py-1 rounded-full transition-colors duration-200 text-sm font-medium"
                                >
                                    {link.name}
                                </a>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-primary-text"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <a
                        href="#"
                        className="bg-accent hover:opacity-90 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg"
                    >
                        {t('navbar.downloadCV')}
                    </a>
                </div>
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center gap-4 md:hidden">
                <LanguageSwitcher />
                <button
                    onClick={toggleTheme}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors text-primary-text"
                    aria-label="Toggle theme"
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button
                    onClick={toggleMenu}
                    className="text-primary-text hover:bg-gray-100 p-1 rounded-full transition-colors"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-primary-bg rounded-2xl shadow-xl overflow-hidden md:hidden border border-gray-100"
                    >
                        <div className="flex flex-col p-4 gap-2">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="px-4 py-3 hover:bg-gray-50 rounded-xl text-primary-text font-medium transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="h-px bg-gray-100 my-2" />
                            <a
                                href="#"
                                className="bg-accent text-white px-4 py-3 rounded-xl text-center font-medium shadow-md active:scale-95 transition-transform"
                                onClick={() => setIsOpen(false)}
                            >
                                {t('navbar.downloadCV')}
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
