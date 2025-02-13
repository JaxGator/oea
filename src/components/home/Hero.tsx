
import { useState } from 'react';

export const Hero = () => {
  const [backgroundImage] = useState('https://www.adamsvanlines.com/wp-content/uploads/2021/07/12-Things-You-Should-Know-Before-Moving-To-Jacksonville-FL-Adams-Van-Lines.b197b0.webp');

  return (
    <div 
      className="relative min-h-[30vh] sm:min-h-[35vh] md:min-h-[40vh] flex items-center justify-center px-4 sm:px-6 lg:px-8"
      role="img"
      aria-label="Jacksonville skyline with the St. Johns River and downtown buildings"
    >
      <img 
        src={backgroundImage}
        alt="Jacksonville Skyline"
        className="absolute inset-0 w-full h-full object-cover object-center"
        role="presentation"
      />
      
      <div className="relative z-10 flex items-center justify-center">
        <div className="container mx-auto text-center">
          <h1 className="sr-only">Outdoor Energy Adventures - Jacksonville's Premier Adventure Community</h1>
          <figure role="none" className="mx-auto space-y-4">
            <img 
              src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
              alt="Outdoor Energy Adventures Logo - A vibrant emblem representing outdoor activities and community spirit"
              className="w-48 sm:w-56 md:w-64 lg:w-80 mx-auto animate-fade-in"
              loading="eager"
              decoding="async"
            />
            <p className="text-white text-lg sm:text-xl md:text-2xl font-medium drop-shadow-lg animate-fade-in bg-black/50 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-lg inline-block">
              Welcome to our new site - built entirely with AI!
            </p>
          </figure>
        </div>
      </div>
    </div>
  );
};

