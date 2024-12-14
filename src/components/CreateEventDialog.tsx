import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { EventForm } from "./event/EventForm";

export function CreateEventDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0d97d1] hover:bg-[#0d97d1]/90">
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <EventForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}