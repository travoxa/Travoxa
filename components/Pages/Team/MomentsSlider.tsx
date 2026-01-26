"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/dist/Draggable";

gsap.registerPlugin(ScrollTrigger, Draggable);

interface Moment {
    title: string;
    image: string;
    desc: string;
}

interface MomentsSliderProps {
    items: Moment[];
}

export default function MomentsSlider({ items }: MomentsSliderProps) {
    const galleryRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLUListElement>(null);
    const dragProxyRef = useRef<HTMLDivElement>(null);
    const [renderItems, setRenderItems] = useState<Moment[]>([]);

    // Ensure we have enough items for a seamless loop by duplicating if necessary
    useEffect(() => {
        if (!items || items.length === 0) {
            setRenderItems([]);
            return;
        }

        // We typically need enough items to cover the visible area + buffer. 
        // 10 is a safe number for this specific layout to ensure smoother infinite scrolling
        let duplicated = [...items];
        while (duplicated.length < 10) {
            duplicated = [...duplicated, ...items];
        }
        setRenderItems(duplicated);
    }, [items]);

    useEffect(() => {
        if (renderItems.length === 0 || !cardsRef.current || !wrapperRef.current || !dragProxyRef.current) return;

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLLIElement>(".moments-card");

            // Initial state: hide everything to avoid flash
            gsap.set(cards, { xPercent: 400, opacity: 0, scale: 0 });

            const spacing = 0.1; // Space between cards relative to timeline duration
            const snapTime = gsap.utils.snap(spacing);

            // Re-usable animation function for a single card's lifecycle
            const animateFunc = (element: HTMLLIElement) => {
                const tl = gsap.timeline();
                tl.fromTo(
                    element,
                    { scale: 0, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        zIndex: 100,
                        duration: 0.5,
                        yoyo: true,
                        repeat: 1,
                        ease: "power1.in",
                        immediateRender: false,
                    }
                ).fromTo(
                    element,
                    { xPercent: 400 },
                    {
                        xPercent: -400,
                        duration: 1,
                        ease: "none",
                        immediateRender: false,
                    },
                    0
                );
                return tl;
            };

            // Build the seamless loop timeline
            const buildSeamlessLoop = (
                items: HTMLLIElement[],
                spacing: number,
                animateFunc: (element: HTMLLIElement) => gsap.core.Timeline
            ) => {
                let overlap = Math.ceil(1 / spacing);
                let startTime = items.length * spacing + 0.5;
                let loopTime = (items.length + overlap) * spacing + 1;
                let rawSequence = gsap.timeline({ paused: true });
                let seamlessLoop = gsap.timeline({
                    paused: true,
                    repeat: -1,
                    onRepeat() {
                        if (this._time === this._dur) {
                            this._tTime += this._dur - 0.01;
                        }
                    },
                });

                let l = items.length + overlap * 2;

                for (let i = 0; i < l; i++) {
                    let index = i % items.length;
                    let item = items[index];
                    let time = i * spacing;
                    rawSequence.add(animateFunc(item), time);
                    if (i <= items.length) {
                        seamlessLoop.add("label" + i, time);
                    }
                }

                rawSequence.time(startTime);
                seamlessLoop.to(rawSequence, {
                    time: loopTime,
                    duration: loopTime - startTime,
                    ease: "none",
                }).fromTo(
                    rawSequence,
                    { time: overlap * spacing + 1 },
                    {
                        time: startTime,
                        duration: startTime - (overlap * spacing + 1),
                        immediateRender: false,
                        ease: "none",
                    }
                );
                return seamlessLoop;
            };

            const seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc);
            seamlessLoop.timeScale(0.025); // Reduced speed significantly for very slow scroll

            // Playhead logic for scrubbing
            const playhead = { offset: 0 };
            const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());

            // The scrub tween moves the playhead
            const scrub = gsap.to(playhead, {
                offset: 0,
                onUpdate() {
                    seamlessLoop.time(wrapTime(playhead.offset));
                },
                onComplete() {
                    // Resume auto-scroll after snapping ONLY on small screens
                    if (window.innerWidth < 1024) {
                        seamlessLoop.play();
                    }
                },
                duration: 0.5,
                ease: "power3",
                paused: true,
            });

            const scrollToOffset = (offset: number) => {
                let snappedTime = snapTime(offset);
                // Handle wrapping for positive/negative values if needed, 
                // but usually the draggable logic handles continuous dragging logic well enough 
                // if we don't clamp explicitly.
                // However, for infinite looping based on 'offset', we just pass it to the scrub.

                // If the user drags really far, we want correct wrapping.
                // But since 'wrapTime' handles the visual time, we just need to animate 
                // the scrub to the 'snapped' target.

                let progress = snappedTime - scrub.vars.offset!;
                // Using a simpler approach: just update the offset destination
                scrub.vars.offset = snappedTime;
                scrub.invalidate().restart();
            };

            // Draggable setup
            const drag = Draggable.create(dragProxyRef.current, {
                type: "x",
                trigger: galleryRef.current, // Drag anywhere in the gallery container
                onPress() {
                    // Stop auto-scroll and sync offsets
                    seamlessLoop.pause();
                    // Sync playhead/scrub to current visual time so we don't jump
                    // @ts-ignore
                    scrub.vars.offset = seamlessLoop.time();
                    playhead.offset = seamlessLoop.time();
                    // @ts-ignore
                    this.startOffset = scrub.vars.offset;
                },
                onDrag() {
                    // @ts-ignore
                    scrub.vars.offset = this.startOffset + (this.startX - this.x) * 0.001;
                    scrub.invalidate().restart();
                },
                onDragEnd() {
                    // Snap to the closest card
                    scrollToOffset(scrub.vars.offset!);
                },
            })[0];

            // Start auto-scroll only on small screens
            let mm = gsap.matchMedia();
            mm.add("(max-width: 1023px)", () => {
                seamlessLoop.play();
            });
            mm.add("(min-width: 1024px)", () => {
                seamlessLoop.pause();
            });
        }, wrapperRef); // Scope to wrapper

        return () => ctx.revert(); // Cleanup on unmount/re-render
    }, [renderItems]);

    if (!items || items.length === 0) return null;

    return (
        <section ref={wrapperRef} className="relative py-8">
            {/* Heading */}
            <div className="mb-8 px-6 lg:px-24 text-center">
                <h2 className="text-3xl md:text-4xl font-extralight text-black Mont">
                    Moments That Built Travoxa
                </h2>
            </div>

            {/* Gallery */}
            <div
                ref={galleryRef}
                className="moments-gallery relative w-[calc(100%+3rem)] -ml-6 lg:w-full lg:ml-0 h-[300px] md:h-[500px] overflow-hidden cursor-grab active:cursor-grabbing"
            >
                <ul ref={cardsRef} className="absolute w-40 h-52 md:w-80 md:h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    {renderItems.map((moment, index) => (
                        <li
                            key={index}
                            className="moments-card list-none p-0 m-0 w-40 h-52 md:w-80 md:h-96 text-center leading-[13rem] md:leading-[24rem] text-2xl absolute top-0 left-0 rounded-2xl bg-cover bg-no-repeat bg-center shadow-2xl bg-zinc-200"
                            style={{ backgroundImage: `url(${moment.image})` }}
                        >
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-b-2xl">
                                <p className="text-white font-semibold text-lg leading-tight mb-1">
                                    {moment.title}
                                </p>
                                <p className="text-white/80 text-xs font-light line-clamp-3 leading-normal">
                                    {moment.desc}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Drag Proxy (invisible) */}
            <div ref={dragProxyRef} className="drag-proxy invisible absolute top-0 left-0 w-full h-full pointer-events-none"></div>
        </section>
    );
}
