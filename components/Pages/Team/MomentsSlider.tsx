"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/dist/Draggable";

gsap.registerPlugin(ScrollTrigger, Draggable);

interface Moment {
    title: string;
    img: string;
}

const moments: Moment[] = [
    { title: "Banaras Ganga Aarti", img: "https://via.placeholder.com/350x500" },
    { title: "Darjeeling Sunrise", img: "https://via.placeholder.com/350x500" },
    { title: "Gangtok Streets", img: "https://via.placeholder.com/350x500" },
    { title: "Ayodhya Ram Mandir", img: "https://via.placeholder.com/350x500" },
    { title: "Varanasi Ghats", img: "https://via.placeholder.com/350x500" },
    { title: "Mayapur Temple", img: "https://via.placeholder.com/350x500" },
    { title: "Delhi Streets", img: "https://via.placeholder.com/350x500" },
];

export default function MomentsSlider() {
    const galleryRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLUListElement>(null);
    const dragProxyRef = useRef<HTMLDivElement>(null);
    const seamlessLoopRef = useRef<gsap.core.Timeline | null>(null);
    const playheadRef = useRef({ offset: 0 });
    const scrubRef = useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
        if (!cardsRef.current || !galleryRef.current || !dragProxyRef.current) return;

        const cards = gsap.utils.toArray<HTMLLIElement>(".moments-card");

        // Set initial state
        gsap.set(cards, { xPercent: 400, opacity: 0, scale: 0 });

        const spacing = 0.1;
        const snapTime = gsap.utils.snap(spacing);

        // Animation function for each card
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

        // Build seamless loop
        const buildSeamlessLoop = (
            items: HTMLLIElement[],
            spacing: number,
            animateFunc: (element: HTMLLIElement) => gsap.core.Timeline
        ) => {
            const overlap = Math.ceil(1 / spacing);
            const startTime = items.length * spacing + 0.5;
            const loopTime = (items.length + overlap) * spacing + 1;
            const rawSequence = gsap.timeline({ paused: true });
            const seamlessLoop = gsap.timeline({
                paused: true,
                repeat: -1,
                onRepeat() {
                    if (this._time === this._dur) {
                        this._tTime += this._dur - 0.01;
                    }
                },
            });

            const l = items.length + overlap * 2;

            for (let i = 0; i < l; i++) {
                const index = i % items.length;
                const time = i * spacing;
                rawSequence.add(animateFunc(items[index]), time);
                if (i <= items.length) {
                    seamlessLoop.add("label" + i, time);
                }
            }

            rawSequence.time(startTime);
            seamlessLoop
                .to(rawSequence, {
                    time: loopTime,
                    duration: loopTime - startTime,
                    ease: "none",
                })
                .fromTo(
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
        seamlessLoopRef.current = seamlessLoop;

        const playhead = playheadRef.current;
        const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());

        // Scrub tween
        const scrub = gsap.to(playhead, {
            offset: 0,
            onUpdate() {
                seamlessLoop.time(wrapTime(playhead.offset));
            },
            duration: 0.5,
            ease: "power3",
            paused: true,
        });
        scrubRef.current = scrub;

        // Scroll to offset function (for drag snapping)
        const scrollToOffset = (offset: number) => {
            const snappedTime = snapTime(offset);
            scrub.vars.offset = snappedTime;
            scrub.invalidate().restart();
        };

        // Draggable
        Draggable.create(dragProxyRef.current, {
            type: "x",
            trigger: cardsRef.current,
            onPress() {
                // @ts-ignore
                this.startOffset = scrub.vars.offset;
            },
            onDrag() {
                // @ts-ignore
                scrub.vars.offset = this.startOffset + (this.startX - this.x) * 0.001;
                scrub.invalidate().restart();
            },
            onDragEnd() {
                scrollToOffset(scrub.vars.offset);
            },
        });

        // Cleanup
        return () => {
            scrub.kill();
            seamlessLoop.kill();
            Draggable.get(dragProxyRef.current!)?.kill();
        };
    }, []);

    return (
        <section className="relative py-8">
            {/* Heading */}
            <div className="mb-8 px-6 lg:px-24 text-center">
                <h2 className="text-3xl md:text-4xl font-extralight text-black Mont">
                    Moments That Built Travoxa
                </h2>
            </div>

            {/* Gallery */}
            <div
                ref={galleryRef}
                className="moments-gallery relative w-full h-[500px] overflow-hidden"
            >
                <ul ref={cardsRef} className="absolute w-80 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {moments.map((moment, index) => (
                        <li
                            key={index}
                            className="moments-card list-none p-0 m-0 w-80 h-96 text-center leading-[24rem] text-2xl absolute top-0 left-0 rounded-2xl bg-cover bg-no-repeat bg-center shadow-2xl bg-zinc-200"
                            style={{ backgroundImage: `url(${moment.img})` }}
                        >
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-b-2xl">
                                <p className="text-white font-semibold text-base leading-tight">
                                    {moment.title}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Drag Proxy */}
            <div ref={dragProxyRef} className="drag-proxy invisible absolute"></div>
        </section>
    );
}
