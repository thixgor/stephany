'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
    'https://i.imgur.com/ppwHH1K.jpeg',
    'https://i.imgur.com/NqmKUYC.jpeg',
    'https://i.imgur.com/CNOQocZ.jpeg',
    'https://i.imgur.com/CPWuc5E.jpeg'
];

export default function HeroImageSlider() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full aspect-[5/6] max-w-[500px] mx-auto rounded-3xl shadow-2xl overflow-hidden group border-4 border-white">
            {images.map((img, i) => (
                <div
                    key={img}
                    className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    <Image
                        src={img}
                        alt={`Dra. Stephany Rodrigues ${i + 1}`}
                        fill
                        className="object-cover"
                        priority={i === 0}
                    />
                </div>
            ))}

            {/* Subtle Overlay to unify the aesthetic */}
            <div className="absolute inset-0 bg-[#00231F]/5 z-20 pointer-events-none" />
        </div>
    );
}
