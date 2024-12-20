interface AboutHeroProps {
  imageUrl: string;
  imageAlt: string;
}

export function AboutHero({ imageUrl, imageAlt }: AboutHeroProps) {
  return (
    <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] mb-12 rounded-lg overflow-hidden">
      <div className="relative w-full h-full">
        <img 
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
            alt="OEA Logo"
            className="w-48 h-48 md:w-64 md:h-64 object-contain"
          />
        </div>
      </div>
    </div>
  );
}