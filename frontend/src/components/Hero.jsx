import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
    const { t } = useTranslation();
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    return (
        <section className="relative min-h-screen w-full flex items-center justify-center pt-32 md:pt-20 px-6 lg:px-20 bg-primary-bg">
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Content - Text */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-6 z-10 text-center lg:text-start"
                >
                    <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold tracking-tight text-primary-text leading-tight">
                        {t('hero.title_start')} <br />
                        <span className="bg-gradient-to-r from-brand-start to-brand-end bg-clip-text text-transparent">
                            {t('hero.title_end')}
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        {t('hero.description')}
                    </motion.p>

                    <motion.div variants={itemVariants} className="text-sm font-semibold text-accent uppercase tracking-wider">
                        {t('hero.edu_title')}
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                        <a href="#projects" className="group bg-accent text-primary-bg px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-opacity-90 transition-all flex items-center gap-2 hover:gap-3">
                            {t('hero.view_work')} <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                        </a>
                        <a href="/blog" className="px-8 py-3 rounded-full font-semibold border-2 border-gray-200 hover:border-accent hover:text-accent transition-colors flex items-center gap-2 text-primary-text">
                            {t('hero.visit_blog')} <ExternalLink size={18} />
                        </a>
                    </motion.div>
                </motion.div>

                {/* Right Content - Visual */}
                <div className="relative flex items-center justify-center h-full min-h-[400px] lg:min-h-[600px]">
                    {/* Animated Blob */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            rotate: [0, 10, -10, 0],
                            borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "60% 40% 30% 70% / 60% 30% 70% 40%", "30% 70% 70% 30% / 30% 30% 70% 70%"]
                        }}
                        transition={{
                            scale: { duration: 1, ease: "easeOut" },
                            opacity: { duration: 1 },
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            borderRadius: { duration: 10, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
                        }}
                        className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-br from-brand-start to-brand-end opacity-20 blur-2xl"
                    />

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.5, type: "spring" }}
                        className="absolute w-[280px] h-[280px] md:w-[450px] md:h-[450px] bg-gradient-to-br from-brand-start/20 to-brand-end/20 rounded-full animate-blob"
                    >
                    </motion.div>

                    {/* Portrait Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="relative z-20 w-[250px] h-[300px] md:w-[350px] md:h-[450px] flex items-end justify-center"
                        style={{
                            y: [0, -20, 0],
                        }}
                    >
                        <motion.img
                            src="/portfolio-img.png"
                            alt="Souleimane Portrait"
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
