import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useState } from "react";
import EventRegistrationForm from "./event-registration/EventRegistrationForm";

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

interface Participant {
  id: string;
  displayName: string;
  realName: string;
  email: string;
  city?: string;
  registrationDate: string;
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
      
      const participantsData: Participant[] = [];
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
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0 overflow-hidden">
        {showRegistrationForm ? (
          <div className="p-6 h-full overflow-y-auto">
            <DialogHeader className="mb-6 sticky top-0 bg-background z-10 pb-4 border-b">
              <DialogTitle>Register for {event.title}</DialogTitle>
            </DialogHeader>
            <EventRegistrationForm
              eventId={event.id}
              userId={user?.uid || ''}
              onSuccess={handleRegistrationSuccess}
              onCancel={() => setShowRegistrationForm(false)}
            />
          </div>
        ) : (
          <>
            <DialogHeader className="p-6 pb-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-3xl font-bold">{event.title}</DialogTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            
            <div className="flex flex-col md:flex-row gap-6 p-6">
              <div className="md:w-1/2">
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-white font-semibold">{event.category}</span>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card/5 backdrop-blur-sm p-4 rounded-lg">
                    <h3 className="font-semibold text-primary mb-1">Date</h3>
                    <p>{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-card/5 backdrop-blur-sm p-4 rounded-lg">
                    <h3 className="font-semibold text-primary mb-1">Location</h3>
                    <p>{event.location}</p>
                  </div>
                  <div className="bg-card/5 backdrop-blur-sm p-4 rounded-lg">
                    <h3 className="font-semibold text-primary mb-1">Participants</h3>
                    <p>{participants?.length || 0} registered</p>
                  </div>
                  <div className="bg-card/5 backdrop-blur-sm p-4 rounded-lg">
                    <h3 className="font-semibold text-primary mb-1">Entrance Fee</h3>
                    <p>{event.is_free ? "Free" : `$${event.entrance_fee?.toFixed(2)}`}</p>
                  </div>
                </div>

                <div className="bg-card/5 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="font-semibold text-primary mb-2">Description</h3>
                  <p className="text-sm leading-relaxed">{event.description}</p>
                </div>

                {!isHost && (
                  <Button 
                    className="w-full" 
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
                <h3 className="font-semibold text-xl mb-4">Participants List</h3>
                {loadingParticipants ? (
                  <p>Loading participants...</p>
                ) : participants && participants.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Display Name</TableHead>
                          <TableHead>Real Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>City</TableHead>
                          <TableHead>Registration Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {participants.map((participant) => (
                          <TableRow key={participant.id}>
                            <TableCell>{participant.displayName}</TableCell>
                            <TableCell>{participant.realName}</TableCell>
                            <TableCell>{participant.email}</TableCell>
                            <TableCell>{participant.city || 'N/A'}</TableCell>
                            <TableCell>
                              {new Date(participant.registrationDate).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-gray-500">No participants registered yet.</p>
                )}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventPreview;