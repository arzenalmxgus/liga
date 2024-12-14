import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs, doc, updateDoc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";
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
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update participant status
      const participantRef = doc(db, 'event_participants', participantId);
      const participantSnap = await getDoc(participantRef);
      
      if (!participantSnap.exists()) {
        throw new Error("Participant not found");
      }

      const participantData = participantSnap.data();

      // Update the status in event_participants collection
      await updateDoc(participantRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid
      });

      // Create a notification document
      await addDoc(collection(db, 'notifications'), {
        userId: participantData.userId,
        eventId: eventId,
        type: 'registration_status',
        status: newStatus,
        message: `Your registration has been ${newStatus}`,
        createdAt: serverTimestamp(),
        read: false
      });

      // Refresh the participants list
      await refetch();
      
      toast({
        title: "Success",
        description: `Participant has been ${newStatus} successfully.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      
      // More specific error messages based on the error type
      let errorMessage = "Failed to update participant status. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes("permission-denied")) {
          errorMessage = "You don't have permission to perform this action.";
        } else if (error.message.includes("not-found")) {
          errorMessage = "Participant record not found.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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