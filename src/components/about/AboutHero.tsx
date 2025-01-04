interface AboutHeroProps {
  imageUrl: string;
  imageAlt: string;
}

export function AboutHero({ imageUrl, imageAlt }: AboutHeroProps) {
  return (
    <div 
      className="w-full h-[300px] md:h-[400px] lg:h-[500px] mb-12 rounded-lg overflow-hidden"
      role="img"
      aria-label={imageAlt}
    >
      <div className="relative w-full h-full">
        {/* Low-quality placeholder */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat blur-sm scale-105"
          style={{ backgroundImage: `url('${imageUrl}?quality=1&width=100')` }}
          role="presentation"
        />
        
        {/* Main image */}
        <img 
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500"
          loading="eager"
          decoding="async"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          role="presentation"
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <figure role="none" className="w-48 h-48 md:w-64 md:h-64">
            <img 
              src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
              alt="OEA Logo - Official emblem of Outdoor Energy Adventures"
              className="w-full h-full object-contain"
              loading="eager"
              decoding="async"
            />
          </figure>
        </div>
      </div>
    </div>
  );
}