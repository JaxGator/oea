interface AboutHeroProps {
  imageUrl: string;
  imageAlt: string;
}

export function AboutHero({ imageUrl, imageAlt }: AboutHeroProps) {
  return (
    <div className="w-full h-[300px] md:h-[400px] mb-12 rounded-lg overflow-hidden">
      <img 
        src={imageUrl}
        alt={imageAlt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}