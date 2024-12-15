import React from 'react';
import { Hero } from '@/components/home/Hero';
import { FeaturedEvents } from '@/components/home/FeaturedEvents';
import { Footer } from '@/components/home/Footer';

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedEvents />
      <Footer />
    </div>
  );
}