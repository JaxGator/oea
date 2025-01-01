import React from 'react';

export const Hero = () => {
  return (
    <div className="relative w-full min-h-[40vh] bg-gradient-to-b from-black/50 to-black/30">
      {/* Background map image */}
      <img
        src="/lovable-uploads/53bdaf35-8c7a-4815-afb8-a444a2586ae4.png"
        alt="Jacksonville map background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay with logo */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <img 
          src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
          alt="Outdoor Energy Adventures Logo"
          className="w-32 h-32 md:w-40 md:h-40 object-contain animate-fade-in"
          loading="eager"
        />
      </div>
    </div>
  );
};