interface AboutHeroProps {
  imageUrl: string;
  imageAlt: string;
}

export function AboutHero({ imageUrl, imageAlt }: AboutHeroProps) {
  return (
    <div className="relative w-full min-h-[30vh] sm:min-h-[35vh] md:min-h-[40vh]">
      {/* Low-quality placeholder */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat blur-sm scale-105"
        style={{ 
          backgroundImage: `url('${imageUrl}?quality=1&width=100')`
        }}
      />
      
      {/* Main image */}
      <img
        src={imageUrl}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover object-bottom transition-opacity duration-500"
        loading="eager"
        decoding="async"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      />
      
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white">About Us</h1>
        <img 
          src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
          alt="OEA Logo"
          className="w-24 h-24 md:w-32 md:h-32 object-contain"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
}