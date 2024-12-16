import { CardHeader } from "@/components/ui/card";

interface EventCardHeaderProps {
  imageUrl: string;
  title: string;
}

export function EventCardHeader({ imageUrl, title }: EventCardHeaderProps) {
  return (
    <CardHeader className="relative p-0">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
    </CardHeader>
  );
}