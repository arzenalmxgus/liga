import { Dialog, DialogContent } from "./ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import EventHeader from "./event-preview/EventHeader";
import EventImage from "./event-preview/EventImage";
import EventDetails from "./event-preview/EventDetails";
import ParticipantsList from "./event-preview/ParticipantsList";
import RegistrationSection from "./event-preview/RegistrationSection";
import EventActions from "./event-preview/EventActions";

interface EventPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    category: string;
    participants: number;
    participants_limit: number;
    image: string;
    description: string;
    entrance_fee: number | null;
    is_free: boolean;
    hostId: string;
  };
  isHost?: boolean;  // Added this line to include isHost in the interface
}

const EventPreview = ({ isOpen, onClose, event, isHost }: EventPreviewProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const { data: isRegistered } = useQuery({
    queryKey: ['event-registration', event.id, user?.uid],
    queryFn: async () => {
      if (!user?.uid) return false;
      const registrationsRef = collection(db, 'event_participants');
      const q = query(
        registrationsRef, 
        where('eventId', '==', event.id),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    },
    enabled: !!user && !!event.id,
  });

  const { data: participants, isLoading: loadingParticipants } = useQuery({
    queryKey: ['event-participants', event.id],
    queryFn: async () => {
      if (!isHost) return [];
      const participantsRef = collection(db, 'event_participants');
      const q = query(participantsRef, where('eventId', '==', event.id));
      const snapshot = await getDocs(q);
      
      const participantsData = [];
      for (const doc of snapshot.docs) {
        const userData = await getDocs(query(
          collection(db, 'profiles'),
          where('userId', '==', doc.data().userId)
        ));
        
        if (!userData.empty) {
          const profile = userData.docs[0].data();
          participantsData.push({
            id: doc.id,
            displayName: profile.displayName || 'N/A',
            realName: profile.realName || 'N/A',
            email: profile.email || 'N/A',
            city: profile.city,
            registrationDate: doc.data().registrationDate,
          });
        }
      }
      return participantsData;
    },
    enabled: isHost && isOpen,
  });

  const handleRegistrationSuccess = () => {
    setShowRegistrationForm(false);
    onClose();
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteDoc(doc(db, 'events', event.id));
      
      const participantsRef = collection(db, 'event_participants');
      const q = query(participantsRef, where('eventId', '==', event.id));
      const snapshot = await getDocs(q);
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      toast({
        title: "Event Deleted",
        description: "The event and all its registrations have been removed.",
      });

      onClose();
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['host-events'] });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete the event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0 overflow-hidden bg-gray-900/95">
        {showRegistrationForm ? (
          <RegistrationSection
            eventId={event.id}
            userId={user?.uid || ''}
            title={event.title}
            onSuccess={handleRegistrationSuccess}
            onClose={() => setShowRegistrationForm(false)}
          />
        ) : (
          <>
            <EventHeader title={event.title} onClose={onClose} />
            
            <div className="flex flex-col md:flex-row gap-6 p-6 overflow-y-auto">
              <div className="md:w-1/2">
                <EventImage 
                  image={event.image}
                  title={event.title}
                  category={event.category}
                />
              </div>

              <div className="md:w-1/2 space-y-6">
                <EventDetails 
                  date={event.date}
                  location={event.location}
                  participants={participants?.length || 0}
                  entrance_fee={event.entrance_fee}
                  is_free={event.is_free}
                />

                <div className="bg-card/5 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="font-semibold text-primary mb-2">Description</h3>
                  <p className="text-sm leading-relaxed text-white">{event.description}</p>
                </div>

                <EventActions 
                  eventId={event.id}
                  isHost={isHost}
                  isRegistered={!!isRegistered}
                  isFull={participants?.length >= event.participants_limit}
                  onRegister={() => setShowRegistrationForm(true)}
                  onClose={onClose}
                  onDelete={handleDeleteEvent}
                />
              </div>
            </div>

            {isHost && (
              <div className="border-t border-gray-800 p-6">
                <h3 className="font-semibold text-xl mb-4 text-white">Participants List</h3>
                <ParticipantsList 
                  participants={participants || []}
                  isLoading={loadingParticipants}
                />
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventPreview;