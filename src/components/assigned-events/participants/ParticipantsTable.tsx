import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ParticipantRow from "./ParticipantRow";

interface Participant {
  id: string;
  displayName: string;
  email: string;
  age: string;
  nationality: string;
  registrationDate: Date;
  status: string;
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
          <ParticipantRow 
            key={participant.id} 
            participant={participant}
            onStatusUpdate={onStatusUpdate}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default ParticipantsTable;