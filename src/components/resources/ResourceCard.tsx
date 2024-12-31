import { Card } from "@/components/ui/card";

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
    <Card className="mb-8 p-6">
      <div className="text-2xl font-semibold mb-4">{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((item, idx) => (
          <a
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-lg hover:bg-primary/5 transition-colors"
          >
            <span className="text-primary hover:text-primary/80 transition-colors">
              {item.label}
            </span>
          </a>
        ))}
      </div>
    </Card>
  );
}