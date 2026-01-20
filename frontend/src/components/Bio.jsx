import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchTimelineEvents } from '../api';
import { useTranslation } from 'react-i18next';

const Bio = () => {
    const { t, i18n } = useTranslation();
    const [events, setEvents] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        const loadEvents = async () => {
            const data = await fetchTimelineEvents(i18n.language);
            // Sort by order if needed, assuming backend does it but good to be safe
            setEvents(data);
        };
        loadEvents();
    }, [i18n.language]);

    useEffect(() => {
        if (events.length === 0) return;

        const startLoop = () => {
            intervalRef.current = setInterval(() => {
                if (!isPaused) {
                    setActiveIndex((prev) => (prev + 1) % events.length);
                }
            }, 6000);
        };

        startLoop();

        return () => clearInterval(intervalRef.current);
    }, [events, isPaused]);

    if (events.length === 0) {
        return null; // Or a loading state
    }

    return (
        <section className="py-20 px-6 lg:px-20 bg-primary-bg overflow-hidden" id="about">
            <div className="container mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -150px 0px" }}
                    className="text-3xl md:text-5xl font-bold text-center mb-16 text-primary-text"
                >
                    {t('bio.title')}
                </motion.h2>

                <div className="flex flex-col md:flex-row gap-12 items-center justify-center max-w-5xl mx-auto">

                    {/* Timeline (Left) */}
                    <div className="flex md:flex-col md:h-[400px] w-full md:w-1/3 justify-between items-center relative gap-4 md:gap-0">
                        {/* Dashed Line */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 border-s-2 border-dashed border-accent/30 -translate-x-1/2" />
                        <div className="md:hidden absolute top-1/2 left-0 right-0 h-0.5 border-t-2 border-dashed border-accent/30 -translate-y-1/2" />

                        {events.map((event, index) => (
                            <div
                                key={event.id}
                                className="relative z-10 cursor-pointer group"
                                onClick={() => {
                                    setActiveIndex(index);
                                    setIsPaused(true); // Pause on manual interaction
                                }}
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                            >
                                <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${index === activeIndex
                                    ? 'bg-primary-bg border-accent scale-150 shadow-[0_0_15px_rgba(14,165,233,0.6)]'
                                    : 'bg-gray-300 border-transparent hover:bg-accent/50'
                                    }`} />
                                <span className={`absolute -top-8 left-1/2 -translate-x-1/2 md:top-1/2 md:start-8 md:-translate-y-1/2 md:translate-x-0 text-sm font-semibold transition-colors duration-300 whitespace-nowrap ${index === activeIndex ? 'text-accent' : 'text-gray-400'
                                    }`}>
                                    {event.year}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Content Card (Right) */}
                    <div
                        className="w-full md:w-2/3 min-h-[250px] relative"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80"
                            >
                                <h3 className="text-2xl font-bold text-accent mb-2">
                                    {events[activeIndex].title}
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {events[activeIndex].description}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Bio;
