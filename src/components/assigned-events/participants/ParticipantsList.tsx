import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ParticipantsTable from "./ParticipantsTable";
import { useAuth } from "@/contexts/AuthContext";
import { handleParticipantStatusUpdate } from "./utils/participantUtils";
import { useToast } from "@/hooks/use-toast";

interface ParticipantsListProps {
  eventId: string;
}

const ParticipantsList = ({ eventId }: ParticipantsListProps) => {
  const { user } = useAuth();
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
        
        participantsData.push({
          id: participantDoc.id,
          status: participantData.status || 'pending',
          displayName: participantData.name || 'Anonymous',
          email: participantData.email || 'No email provided',
          age: participantData.age || 'N/A',
          nationality: participantData.nationality || 'N/A',
          registrationDate: participantData.registrationDate instanceof Date 
            ? participantData.registrationDate 
            : new Date(participantData.registrationDate),
        });
      }
      
      return participantsData;
    },
    enabled: !!eventId,
  });

  const handleStatusUpdate = async (participantId: string, newStatus: 'approved' | 'rejected', message?: string) => {
    try {
      await handleParticipantStatusUpdate(participantId, newStatus, eventId, message);
      await refetch();
      
      toast({
        title: `Participant ${newStatus}`,
        description: `The participant has been ${newStatus} successfully.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update participant status. Please ensure you have the correct permissions.",
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
      <ParticipantsTable 
        participants={participants}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default ParticipantsList;