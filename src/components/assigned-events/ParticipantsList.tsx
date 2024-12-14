import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ParticipantsListProps {
  eventId: string;
}

const ParticipantsList = ({ eventId }: ParticipantsListProps) => {
  const { toast } = useToast();

  const { data: participants, isLoading, refetch } = useQuery({
    queryKey: ['event-participants', eventId],
    queryFn: async () => {
      console.log("Starting participants query for event:", eventId);
      const participantsRef = collection(db, 'event_participants');
      const q = query(participantsRef, where('eventId', '==', eventId));
      const snapshot = await getDocs(q);
      console.log("Found participants:", snapshot.size);
      
      const participantsData = [];
      
      for (const participantDoc of snapshot.docs) {
        const participantData = participantDoc.data();
        console.log("Processing participant data:", participantData);
        
        try {
          // Get user profile data from the profiles collection
          const userProfileRef = collection(db, 'profiles');
          const userProfileQuery = query(userProfileRef, where('userId', '==', participantData.userId));
          const userProfileSnapshot = await getDocs(userProfileQuery);
          
          if (!userProfileSnapshot.empty) {
            const profile = userProfileSnapshot.docs[0].data();
            participantsData.push({
              id: participantDoc.id,
              status: participantData.status || 'pending',
              displayName: profile.displayName || profile.name || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Anonymous',
              email: profile.email || participantData.email || 'No email provided',
              registrationDate: participantData.registrationDate?.toDate() || new Date(),
              age: participantData.age || 'N/A',
              nationality: participantData.nationality || 'N/A',
              dateOfBirth: participantData.dateOfBirth || 'N/A',
            });
            console.log("Added participant to list:", participantsData[participantsData.length - 1]);
          } else {
            // If no profile found, still add the participant with available data
            participantsData.push({
              id: participantDoc.id,
              status: participantData.status || 'pending',
              displayName: participantData.name || 'Anonymous',
              email: participantData.email || 'No email provided',
              registrationDate: participantData.registrationDate?.toDate() || new Date(),
              age: participantData.age || 'N/A',
              nationality: participantData.nationality || 'N/A',
              dateOfBirth: participantData.dateOfBirth || 'N/A',
            });
            console.log("Added participant without profile:", participantsData[participantsData.length - 1]);
          }
        } catch (error) {
          console.error("Error processing participant:", error);
        }
      }
      
      console.log("Final participants data:", participantsData);
      return participantsData;
    },
    enabled: !!eventId,
  });

  const handleStatusUpdate = async (participantId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const participantRef = doc(db, 'event_participants', participantId);
      await updateDoc(participantRef, { status: newStatus });
      await refetch();
      
      toast({
        title: `Participant ${newStatus}`,
        description: `The participant has been ${newStatus} successfully.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update participant status.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-white p-4">Loading participants...</div>;
  }

  if (!participants?.length) {
    return <div className="text-gray-400 p-4">No participants registered yet.</div>;
  }

  return (
    <div className="space-y-4">
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
                {participant.registrationDate instanceof Date 
                  ? participant.registrationDate.toLocaleDateString()
                  : 'N/A'}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  participant.status === 'approved' 
                    ? 'bg-green-600/20 text-green-400' 
                    : participant.status === 'rejected'
                    ? 'bg-red-600/20 text-red-400'
                    : 'bg-yellow-600/20 text-yellow-400'
                }`}>
                  {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                {participant.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleStatusUpdate(participant.id, 'approved')}
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(participant.id, 'rejected')}
                      variant="destructive"
                      size="sm"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ParticipantsList;