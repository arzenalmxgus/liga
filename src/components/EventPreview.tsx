import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";
import EventRegistrationForm from "./event-registration/EventRegistrationForm";
import EventHeader from "./event-preview/EventHeader";
import EventImage from "./event-preview/EventImage";
import EventDetails from "./event-preview/EventDetails";
import ParticipantsList from "./event-preview/ParticipantsList";

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
}

const EventPreview = ({ isOpen, onClose, event }: EventPreviewProps) => {
  const { user } = useAuth();
  const isHost = user?.uid === event.hostId;
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0 overflow-hidden bg-gray-900/95">
        {showRegistrationForm ? (
          <div className="p-6 h-full overflow-y-auto">
            <EventHeader 
              title={`Register for ${event.title}`} 
              onClose={() => setShowRegistrationForm(false)} 
            />
            <EventRegistrationForm
              eventId={event.id}
              userId={user?.uid || ''}
              onSuccess={handleRegistrationSuccess}
              onCancel={() => setShowRegistrationForm(false)}
            />
          </div>
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

                {!isHost && (
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    onClick={() => setShowRegistrationForm(true)}
                    disabled={participants?.length >= event.participants_limit}
                  >
                    {participants?.length >= event.participants_limit 
                      ? "Event Full" 
                      : "Register for Event"
                    }
                  </Button>
                )}
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