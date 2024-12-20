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
      </div>
    </div>
  );
}