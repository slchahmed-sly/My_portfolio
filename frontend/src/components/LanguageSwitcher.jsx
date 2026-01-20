import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    useEffect(() => {
        const root = document.documentElement;
        if (i18n.language === 'ar') {
            root.dir = 'rtl';
            root.lang = 'ar';
        } else {
            root.dir = 'ltr';
            root.lang = i18n.language;
        }
    }, [i18n.language]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const languages = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
        { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-primary-text flex items-center justify-center"
                aria-label="Change Language"
            >
                <Globe size={20} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden z-50 origin-top-right rtl:origin-top-left rtl:right-auto rtl:left-0"
                    >
                        <div className="py-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={`w-full text-left rtl:text-right px-4 py-2.5 text-sm flex items-center gap-3 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800
                                        ${i18n.language === lang.code ? 'text-accent font-medium bg-gray-50 dark:bg-zinc-800' : 'text-zinc-700 dark:text-zinc-400'}
                                    `}
                                >
                                    <span className="text-base">{lang.flag}</span>
                                    <span className="flex-1">{lang.label}</span>
                                    {i18n.language === lang.code && <Check size={16} className="text-accent" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSwitcher;
