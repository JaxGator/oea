import React, { useState, useEffect } from 'react';
import { EditableContent } from '../EditableContent';

export const Hero = () => {
  const [backgroundImage, setBackgroundImage] = useState('https://images.unsplash.com/photo-1472745942893-4b9f730c7668?q=80&w=2069&auto=format&fit=crop');

  return (
    <div 
      className="relative min-h-[30vh] sm:min-h-[35vh] md:min-h-[40vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('${backgroundImage}')`
      }}
    >
      <div className="container mx-auto text-center">
        <img 
          src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
          alt="Outdoor Energy Adventures Logo"
          className="w-48 sm:w-56 md:w-64 lg:w-80 mx-auto mb-6 sm:mb-8 animate-fade-in"
        />
      </div>
      <div className="absolute bottom-4 right-4 bg-black/50 p-2 rounded text-white max-w-md">
        <EditableContent
          content={backgroundImage}
          pageId="home"
          sectionId="hero-background"
          onUpdate={setBackgroundImage}
        />
      </div>
    </div>
  );
};