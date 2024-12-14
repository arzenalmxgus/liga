import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs, doc, updateDoc, getDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import ParticipantsTable from "./participants/ParticipantsTable";

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
          const userProfileRef = collection(db, 'profiles');
          const userProfileQuery = query(userProfileRef, where('userId', '==', participantData.userId));
          const userProfileSnapshot = await getDocs(userProfileQuery);
          
          if (!userProfileSnapshot.empty) {
            const profile = userProfileSnapshot.docs[0].data();
            
            // Handle registration date whether it's a Firestore timestamp or ISO string
            let registrationDate;
            if (participantData.registrationDate?.toDate) {
              registrationDate = participantData.registrationDate.toDate();
            } else if (typeof participantData.registrationDate === 'string') {
              registrationDate = new Date(participantData.registrationDate);
            } else {
              registrationDate = new Date();
            }

            participantsData.push({
              id: participantDoc.id,
              status: participantData.status || 'pending',
              displayName: profile.displayName || profile.name || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Anonymous',
              email: profile.email || participantData.email || 'No email provided',
              registrationDate,
              age: participantData.age || 'N/A',
              nationality: participantData.nationality || 'N/A',
              dateOfBirth: participantData.dateOfBirth || 'N/A',
              userId: participantData.userId,
            });
          } else {
            // Handle case where profile is not found
            let registrationDate;
            if (participantData.registrationDate?.toDate) {
              registrationDate = participantData.registrationDate.toDate();
            } else if (typeof participantData.registrationDate === 'string') {
              registrationDate = new Date(participantData.registrationDate);
            } else {
              registrationDate = new Date();
            }

            participantsData.push({
              id: participantDoc.id,
              status: participantData.status || 'pending',
              displayName: participantData.name || 'Anonymous',
              email: participantData.email || 'No email provided',
              registrationDate,
              age: participantData.age || 'N/A',
              nationality: participantData.nationality || 'N/A',
              dateOfBirth: participantData.dateOfBirth || 'N/A',
              userId: participantData.userId,
            });
          }
        } catch (error) {
          console.error("Error processing participant:", error);
        }
      }
      
      return participantsData;
    },
    enabled: !!eventId,
  });

  const handleStatusUpdate = async (participantId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const participantRef = doc(db, 'event_participants', participantId);
      const participantDoc = await getDoc(participantRef);
      const participantData = participantDoc.data();
      
      await updateDoc(participantRef, { 
        status: newStatus,
        visible: newStatus === 'approved'
      });
      
      // Create notification in Firestore
      const notificationsRef = collection(db, 'notifications');
      await addDoc(notificationsRef, {
        userId: participantData?.userId,
        message: newStatus === 'approved' 
          ? "You have been approved for the event!" 
          : "You have been rejected from the event.",
        status: newStatus,
        eventId: eventId,
        createdAt: new Date(),
        read: false
      });

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
      <ParticipantsTable 
        participants={participants}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default ParticipantsList;