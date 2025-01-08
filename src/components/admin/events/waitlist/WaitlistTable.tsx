import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { WaitlistEntry } from "./types";

interface WaitlistTableProps {
  entries: WaitlistEntry[];
  isProcessing: boolean;
  currentRSVPs?: number;
  maxGuests: number;
  onPromote: (rsvpId: string) => void;
}

export function WaitlistTable({ 
  entries = [], 
  isProcessing, 
  currentRSVPs, 
  maxGuests,
  onPromote 
}: WaitlistTableProps) {
  return (
    <ScrollArea className="h-[300px] rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Joined Waitlist</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries?.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                {entry.profiles.full_name || entry.profiles.username}
              </TableCell>
              <TableCell>
                {new Date(entry.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  onClick={() => onPromote(entry.id)}
                  disabled={isProcessing || (currentRSVPs && currentRSVPs >= maxGuests)}
                >
                  Promote to Attendee
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}