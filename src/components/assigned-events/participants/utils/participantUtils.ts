import { doc, updateDoc, getDoc, collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const handleParticipantStatusUpdate = async (
  participantId: string, 
  newStatus: 'approved' | 'rejected',
  eventId: string
) => {
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
};