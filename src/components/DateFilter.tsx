import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface DateFilterProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
}

export function DateFilter({ selectedDate, onDateSelect }: DateFilterProps) {
  const dates = [
    { label: "All", date: null },
    { label: "Today", date: new Date() },
    { label: "Tomorrow", date: new Date(new Date().setDate(new Date().getDate() + 1)) },
    { label: "This Weekend", date: new Date(new Date().setDate(new Date().getDate() + (6 - new Date().getDay()))) },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
      {dates.map((item) => (
        <Button
          key={item.label}
          variant={selectedDate === item.date ? "default" : "outline"}
          className={`whitespace-nowrap ${
            selectedDate === item.date
              ? "bg-[#0d97d1] hover:bg-[#0d97d1]/90"
              : "hover:bg-[#0d97d1]/10"
          }`}
          onClick={() => onDateSelect(item.date)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}