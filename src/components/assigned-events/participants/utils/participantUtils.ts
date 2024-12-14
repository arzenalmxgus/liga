import { doc, updateDoc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

export const handleParticipantStatusUpdate = async (
  participantId: string, 
  newStatus: 'approved' | 'rejected',
  eventId: string
) => {
  try {
    const participantRef = doc(db, 'event_participants', participantId);
    const participantDoc = await getDoc(participantRef);
    
    if (!participantDoc.exists()) {
      toast({
        title: "Error",
        description: "Participant not found",
        variant: "destructive",
      });
      return;
    }

    const participantData = participantDoc.data();
    
    // Update participant status
    await updateDoc(participantRef, { 
      status: newStatus,
      visible: newStatus === 'approved',
      updatedAt: serverTimestamp()
    });
    
    // Create notification
    const notificationsRef = collection(db, 'notifications');
    await addDoc(notificationsRef, {
      userId: participantData?.userId,
      message: newStatus === 'approved' 
        ? "Your participation request has been approved!" 
        : "Your participation request has been rejected.",
      status: newStatus,
      eventId: eventId,
      createdAt: serverTimestamp(),
      read: false,
      type: 'participant_status_update'
    });

    toast({
      title: "Success",
      description: `Participant ${newStatus} successfully`,
    });

  } catch (error) {
    console.error('Error updating participant status:', error);
    toast({
      title: "Error",
      description: "Failed to update participant status",
      variant: "destructive",
    });
  }
};