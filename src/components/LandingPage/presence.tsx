'use client';

import React from 'react';
import { Globe } from '@/components/magicui/globe';

const locations = [
  {
    id: 1,
    name: 'BRASIL',
    lat: -14.235004,
    long: -51.92528,
  },
  {
    id: 2,
    name: 'PORTUGAL',
    lat: 39.399872,
    long: -8.224454,
  },
  {
    id: 3,
    name: 'USA',
    lat: 36.966428,
    long: -95.844032,
  },
  
 
];

export const Presence = () => {
  return (
    <section className="w-full bg-black text-white mt-10 py-4 md:py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-2 md:mb-1">
          <div className="inline-block px-4 py-1.5 mb-2 md:mb-1 rounded-full bg-zinc-800/40 backdrop-blur-sm">
            <span className="text-sm font-medium">Presence</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Our applications in different places
          </h2>
        </div>

        {/* Globe Container */}
        <div className="relative w-full aspect-square max-w-2xl mx-auto flex items-center justify-center">
          <Globe
            config={{
              width: 800,
              height: 800,
              devicePixelRatio: 2,
              phi: 0,
              theta: 0.3,
              dark: 1,
              diffuse: 1.2,
              mapSamples: 16000,
              mapBrightness: 6,
              baseColor: [0.2, 0.2, 0.2], // neutral gray dots
              markerColor: [0.13, 0.77, 0.37], // green (#22c55e)
              glowColor: [0.1, 0.1, 0.1],
              markers: locations.map((point) => ({
                location: [point.lat, point.long],
                size: 0.1,
              })),
              onRender: () => {},
            }}
            className="opacity-100"
          />
        </div>
      </div>
    </section>
  );
};

export default Presence;
