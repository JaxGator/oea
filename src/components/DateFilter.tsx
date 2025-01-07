import { Button } from "@/components/ui/button";

interface DateFilterProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
}

export function DateFilter({ 
  selectedDate = null, 
  onDateSelect 
}: DateFilterProps) {
  const getNextWeekendDate = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 6 is Saturday
    
    // Calculate days until next Saturday
    const daysUntilSaturday = (6 - currentDay + 7) % 7;
    
    // If today is Sunday, use today's date
    if (currentDay === 0) {
      return today;
    }
    
    // Create date for next Saturday
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + daysUntilSaturday);
    // Reset time to start of day
    nextSaturday.setHours(0, 0, 0, 0);
    
    return nextSaturday;
  };

  const dates = [
    { label: "All", date: null },
    { 
      label: "This Weekend", 
      date: getNextWeekendDate()
    },
  ];

  const handleDateSelect = (date: Date | null) => {
    try {
      onDateSelect(date);
    } catch (error) {
      console.error("Error selecting date:", error);
    }
  };

  const isSelectedDate = (itemDate: Date | null) => {
    if (itemDate === null && selectedDate === null) return true;
    if (itemDate === null || selectedDate === null) return false;
    
    return itemDate.getTime() === selectedDate.getTime();
  };

  return (
    <div className="flex gap-2">
      {dates.map((item) => (
        <Button
          key={item.label}
          variant={isSelectedDate(item.date) ? "default" : "outline"}
          className={`${
            isSelectedDate(item.date)
              ? "bg-[#0d97d1] hover:bg-[#0d97d1]/90"
              : "hover:bg-[#0d97d1]/10"
          }`}
          onClick={() => handleDateSelect(item.date)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}