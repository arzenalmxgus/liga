import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Participant {
  id: string;
  displayName: string;
  email: string;
  age: string;
  nationality: string;
  registrationDate: Date;
  status: string;
  dateOfBirth: string;
}

interface ParticipantsTableProps {
  participants: Participant[];
  onStatusUpdate: (participantId: string, status: 'approved' | 'rejected', message?: string) => Promise<void>;
}

const ParticipantsTable = ({ participants, onStatusUpdate }: ParticipantsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-white">Name</TableHead>
          <TableHead className="text-white">Email</TableHead>
          <TableHead className="text-white">Age</TableHead>
          <TableHead className="text-white">Nationality</TableHead>
          <TableHead className="text-white">Registration Date</TableHead>
          <TableHead className="text-white">Status</TableHead>
          <TableHead className="text-white">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {participants.map((participant) => (
          <TableRow key={participant.id}>
            <TableCell className="text-white">{participant.displayName}</TableCell>
            <TableCell className="text-white">{participant.email}</TableCell>
            <TableCell className="text-white">{participant.age}</TableCell>
            <TableCell className="text-white">{participant.nationality}</TableCell>
            <TableCell className="text-white">
              {format(participant.registrationDate, 'PPP')}
            </TableCell>
            <TableCell className="text-white capitalize">{participant.status}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onStatusUpdate(participant.id, 'approved')}
                  disabled={participant.status === 'approved'}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onStatusUpdate(participant.id, 'rejected', 'Not eligible')}
                  disabled={participant.status === 'rejected'}
                >
                  Reject
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ParticipantsTable;