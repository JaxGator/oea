import React from 'react';

export const Hero = () => {
  const backgroundImage = 'https://www.adamsvanlines.com/wp-content/uploads/2021/07/12-Things-You-Should-Know-Before-Moving-To-Jacksonville-FL-Adams-Van-Lines.b197b0.webp';

  return (
    <div className="relative w-full min-h-[30vh] sm:min-h-[35vh] md:min-h-[40vh]">
      {/* Low-quality placeholder */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat blur-sm scale-105"
        style={{ 
          backgroundImage: `url('${backgroundImage}?quality=1&width=100')`
        }}
      />
      
      {/* Main image */}
      <img
        src={backgroundImage}
        alt="Jacksonville cityscape"
        className="absolute inset-0 w-full h-full object-cover object-bottom transition-opacity duration-500"
        loading="eager"
        decoding="async"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      />
      
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center space-y-6">
        <img 
          src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
          alt="Outdoor Energy Adventures Logo"
          className="w-48 h-48 md:w-64 md:h-64 object-contain animate-fade-in"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
};