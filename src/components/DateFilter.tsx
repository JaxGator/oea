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
    
    // If today is already part of the weekend (Fri, Sat, or Sun), return today
    if (currentDay === 5 || currentDay === 6 || currentDay === 0) {
      const weekendStart = new Date(today);
      weekendStart.setHours(0, 0, 0, 0);
      return weekendStart;
    }
    
    // Calculate days until next Friday
    const daysUntilFriday = (5 - currentDay + 7) % 7;
    
    // Create date for next Friday
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + daysUntilFriday);
    // Reset time to start of day
    nextFriday.setHours(0, 0, 0, 0);
    
    return nextFriday;
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