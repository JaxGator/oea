import React from 'react';
import { Hero } from '@/components/home/Hero';
import { FeaturedEvents } from '@/components/home/FeaturedEvents';

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedEvents />
    </div>
  );
}