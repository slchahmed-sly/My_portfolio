import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSkills } from '../api';

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [activeTab, setActiveTab] = useState('WEB'); // 'WEB' or 'DATA'

    useEffect(() => {
        const loadSkills = async () => {
            const data = await fetchSkills();
            setSkills(data);
        };
        loadSkills();
    }, []);

    // Filter skills based on tab
    const filteredSkills = skills.filter(skill => {
        if (activeTab === 'WEB') return skill.category === 'WEB' || skill.category === 'TOOLS'; // Include tools in Web for now or handle appropriately
        if (activeTab === 'DATA') return skill.category === 'DATA';
        return false;
    });

    // Duplicate for infinite marquee
    const marqueeSkills = [...filteredSkills, ...filteredSkills, ...filteredSkills];

    const tabVariants = {
        inactive: { opacity: 0.5, scale: 0.9 },
        active: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300 } }
    };

    return (
        <section className="py-10 pb-20 bg-primary-bg" id="skills">
            <div className="container mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold text-center mb-12 text-primary-text"
                >
                    Skill Arsenal
                </motion.h2>

                {/* Tabs */}
                <div className="flex justify-center gap-6 mb-16">
                    <button
                        onClick={() => setActiveTab('WEB')}
                        className={`relative px-4 py-2 text-sm md:px-8 md:py-3 md:text-lg rounded-full font-bold transition-all duration-300 ${activeTab === 'WEB' ? 'text-white' : 'text-gray-400 hover:text-gray-600 bg-gray-200 dark:bg-slate-800'
                            }`}
                    >
                        {activeTab === 'WEB' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-accent rounded-full shadow-lg"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">Web Engineering</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('DATA')}
                        className={`relative px-4 py-2 text-sm md:px-8 md:py-3 md:text-lg rounded-full font-bold transition-all duration-300 ${activeTab === 'DATA' ? 'text-white' : 'text-gray-400 hover:text-gray-600 bg-gray-200 dark:bg-slate-800'
                            }`}
                    >
                        {activeTab === 'DATA' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-brand-end rounded-full shadow-lg"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">Data Intelligence</span>
                    </button>
                </div>

                {/* Marquee Area */}
                <div className="relative overflow-hidden w-full h-40 flex items-center">
                    {/* Gradients to fade edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 dark:from-slate-900 to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 dark:from-slate-900 to-transparent z-10" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab} // re-render marquee on tab change
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="flex"
                        >
                            <motion.div
                                className="flex gap-12 px-12"
                                animate={{ x: ["0%", "-33.33%"] }} // Scroll 1/3 of the duplicated content
                                transition={{
                                    repeat: Infinity,
                                    duration: 25, // Adjust speed
                                    ease: "linear",
                                    repeatType: "loop"
                                }}
                            >
                                {marqueeSkills.map((skill, idx) => (
                                    <div
                                        key={`${skill.id}-${idx}`}
                                        className="flex flex-col items-center justify-center gap-3 w-32 group cursor-default"
                                    >
                                        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-gray-100 dark:border-slate-700">
                                            {skill.logo ? (
                                                <img src={skill.logo} alt={skill.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <div className="text-2xl font-bold text-gray-400">{skill.name[0]}</div>
                                            )}
                                        </div>
                                        <span className="font-medium text-primary-text opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                                            {skill.name}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default Skills;
