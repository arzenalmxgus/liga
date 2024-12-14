import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import ParticipantsTable from "./participants/ParticipantsTable";
import { useAuth } from "@/contexts/AuthContext";

interface ParticipantsListProps {
  eventId: string;
}

const ParticipantsList = ({ eventId }: ParticipantsListProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: participants, isLoading } = useQuery({
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
          // Get user profile data directly using userId as document ID
          const userProfileDoc = await getDocs(doc(db, 'profiles', participantData.userId));
          
          console.log("Checking profile for userId:", participantData.userId);
          
          let profile = null;
          if (userProfileDoc.exists()) {
            profile = userProfileDoc.data();
            console.log("Found profile:", profile);
          } else {
            console.log("No profile document found, using participant data only");
          }
          
          let registrationDate;
          try {
            if (participantData.registrationDate?.toDate) {
              registrationDate = participantData.registrationDate.toDate();
            } else if (participantData.registrationDate) {
              registrationDate = new Date(participantData.registrationDate);
            } else {
              registrationDate = new Date();
            }
          } catch (error) {
            console.error("Error processing registration date:", error);
            registrationDate = new Date();
          }

          const participantInfo = {
            id: participantDoc.id,
            status: participantData.status || 'pending',
            displayName: profile?.displayName || participantData.name || 'Anonymous',
            email: profile?.email || participantData.email || 'No email provided',
            registrationDate,
            age: participantData.age || 'N/A',
            nationality: participantData.nationality || 'N/A',
            dateOfBirth: participantData.dateOfBirth || 'N/A',
            userId: participantData.userId,
            eventId: participantData.eventId,
          };
          
          console.log("Adding participant info to list:", participantInfo);
          participantsData.push(participantInfo);
          
        } catch (error) {
          console.error("Error processing participant:", error);
          toast({
            title: "Error",
            description: "Failed to load participant data. Please try again.",
            variant: "destructive",
          });
        }
      }
      
      console.log("Final participants data:", participantsData);
      return participantsData;
    },
    enabled: !!eventId,
  });

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
        onStatusUpdate={async (participantId: string, newStatus: 'approved' | 'rejected', message?: string) => {
          try {
            const participantRef = doc(db, 'event_participants', participantId);
            await updateDoc(participantRef, {
              status: newStatus,
              updatedAt: serverTimestamp(),
              updatedBy: user?.uid,
              rejectionMessage: newStatus === 'rejected' ? message : null
            });

            toast({
              title: "Success",
              description: `Participant has been ${newStatus} successfully.`,
            });
          } catch (error) {
            console.error("Error updating status:", error);
            toast({
              title: "Error",
              description: "Failed to update participant status. Please try again.",
              variant: "destructive",
            });
          }
        }}
      />
    </div>
  );
};

export default ParticipantsList;