import React, { useState } from 'react';

export const Hero = () => {
  const [backgroundImage] = useState('https://www.adamsvanlines.com/wp-content/uploads/2021/07/12-Things-You-Should-Know-Before-Moving-To-Jacksonville-FL-Adams-Van-Lines.b197b0.webp');

  return (
    <div 
      className="relative min-h-[30vh] sm:min-h-[35vh] md:min-h-[40vh] flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      {/* Background Image with loading optimization */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat blur-sm scale-105"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-500"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      
      <div className="container mx-auto text-center relative z-10">
        <img 
          src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
          alt="Outdoor Energy Adventures Logo"
          className="w-48 sm:w-56 md:w-64 lg:w-80 mx-auto mb-6 sm:mb-8 animate-fade-in"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
};