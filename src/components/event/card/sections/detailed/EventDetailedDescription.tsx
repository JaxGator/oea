
interface EventDetailedDescriptionProps {
  description: string | null;
}

export function EventDetailedDescription({ description }: EventDetailedDescriptionProps) {
  if (!description) return null;
  
  return (
    <div className="prose max-w-none">
      <div dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );
}
