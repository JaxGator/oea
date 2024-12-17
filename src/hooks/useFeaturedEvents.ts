import { useEventFetch } from "./events/useEventFetch";
import { useRSVPManagement } from "./events/useRSVPManagement";

export function useFeaturedEvents() {
  const { data: events = [], isLoading } = useEventFetch();
  const { userRSVPs, handleRSVP, handleCancelRSVP } = useRSVPManagement();

  return {
    events,
    isLoading,
    userRSVPs,
    handleRSVP,
    handleCancelRSVP,
  };
}