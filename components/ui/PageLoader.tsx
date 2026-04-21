'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from './Spinner';

/**
 * Global Page Loader Component
 * Intercepts internal link clicks and shows a premium animation during navigation.
 */
function LoaderContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    // Hide loader whenever the pathname or search params change (navigation complete)
    useEffect(() => {
        setIsLoading(false);
    }, [pathname, searchParams]);

    useEffect(() => {
        const handleLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');

            if (anchor && anchor.href) {
                const url = new URL(anchor.href);
                const isInternal = url.origin === window.location.origin;
                const isSamePage = url.pathname === window.location.pathname && url.search === window.location.search;
                const isHash = url.hash !== '' && isSamePage;
                const isModifiedClick = e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0;
                const isTargetBlank = anchor.target === '_blank';

                // Only show loader for internal, non-modified, non-hash navigation
                if (isInternal && !isHash && !isModifiedClick && !isTargetBlank && !isSamePage) {
                    setIsLoading(true);
                }
            }
        };

        document.addEventListener('click', handleLinkClick);
        return () => document.removeEventListener('click', handleLinkClick);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm"
                >
                    <div className="relative flex flex-col items-center">
                        {/* Unified Spinner Component */}
                        <Spinner 
                            size="lg" 
                            text="Drafting your journey" 
                        />
                        
                        {/* Floating Dots (Kept for brand flair) */}
                        <div className="mt-8 flex gap-2">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ 
                                        repeat: Infinity, 
                                        duration: 0.6, 
                                        delay: i * 0.1,
                                        ease: "easeInOut" 
                                    }}
                                    className="w-2 h-2 rounded-full bg-emerald-500"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Progress line at the very top */}
                    <motion.div
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 4, ease: "easeOut" }}
                        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function PageLoader() {
    return (
        <Suspense fallback={null}>
            <LoaderContent />
        </Suspense>
    );
}
