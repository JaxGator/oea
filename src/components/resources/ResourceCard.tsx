import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface ResourceLink {
  label: string;
  url: string;
}

interface ResourceCardProps {
  title: string;
  links: ResourceLink[];
}

export function ResourceCard({ title, links }: ResourceCardProps) {
  return (
    <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
      <h2 className="text-2xl font-bold text-primary mb-8">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map((item, idx) => (
          <a
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 p-4 rounded-lg hover:bg-primary/5 transition-all duration-200"
          >
            <span className="text-foreground group-hover:text-primary transition-colors flex-1">
              {item.label}
            </span>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
        ))}
      </div>
    </Card>
  );
}