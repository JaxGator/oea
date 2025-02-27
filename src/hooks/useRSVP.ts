
import { useRSVPMutation } from "./rsvp/useRSVPMutation";
import { useRSVPCancellation } from "./rsvp/useRSVPCancellation";

interface Guest {
  firstName: string;
}

export const useRSVP = () => {
  const { handleRSVP } = useRSVPMutation();
  const { cancelRSVP } = useRSVPCancellation();

  return {
    handleRSVP,
    cancelRSVP
  };
};
