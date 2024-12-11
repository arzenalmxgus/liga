import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Participant {
  id: string;
  displayName: string;
  realName: string;
  email: string;
  city?: string;
  registrationDate: string;
}

interface ParticipantsListProps {
  participants: Participant[];
  isLoading: boolean;
}

const ParticipantsList = ({ participants, isLoading }: ParticipantsListProps) => {
  if (isLoading) return <p className="text-white">Loading participants...</p>;
  
  if (!participants.length) {
    return <p className="text-gray-400">No participants registered yet.</p>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Display Name</TableHead>
            <TableHead className="text-white">Real Name</TableHead>
            <TableHead className="text-white">Email</TableHead>
            <TableHead className="text-white">City</TableHead>
            <TableHead className="text-white">Registration Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell className="text-white">{participant.displayName}</TableCell>
              <TableCell className="text-white">{participant.realName}</TableCell>
              <TableCell className="text-white">{participant.email}</TableCell>
              <TableCell className="text-white">{participant.city || 'N/A'}</TableCell>
              <TableCell className="text-white">
                {new Date(participant.registrationDate).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ParticipantsList;