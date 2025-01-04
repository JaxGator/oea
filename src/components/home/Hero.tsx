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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Outdoor Energy Adventures
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-md">
            Jacksonville's Premier Adventure Community
          </p>
          <figure role="none" className="mx-auto">
            <img 
              src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
              alt="Outdoor Energy Adventures Logo - A vibrant emblem representing outdoor activities and community spirit"
              className="w-48 sm:w-56 md:w-64 lg:w-80 mx-auto animate-fade-in"
              loading="eager"
              decoding="async"
            />
          </figure>
        </div>
      </div>
    </div>
  );
};