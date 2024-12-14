import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ParticipantRow from "./ParticipantRow";

interface ParticipantsTableProps {
  participants: any[];
  onStatusUpdate: (participantId: string, status: 'approved' | 'rejected') => Promise<void>;
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