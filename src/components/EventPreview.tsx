import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface EventPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="mt-4">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-64 object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          <div className="mt-4 space-y-3">
            <div>
              <h3 className="font-semibold">Date</h3>
              <p>{new Date(event.date).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{event.location}</p>
            </div>
            <div>
              <h3 className="font-semibold">Category</h3>
              <p>{event.category}</p>
            </div>
            <div>
              <h3 className="font-semibold">Participants</h3>
              <p>{event.participants}/{event.participants_limit} registered</p>
            </div>
            <div>
              <h3 className="font-semibold">Entrance Fee</h3>
              <p>{event.is_free ? "Free" : `$${event.entrance_fee?.toFixed(2)}`}</p>
            </div>
            <div>
              <h3 className="font-semibold">Description</h3>
              <p>{event.description}</p>
            </div>
          </div>

          {isHost && (
            <div className="mt-6">
              <h3 className="font-semibold mb-4">Participants List</h3>
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

          <div className="mt-6">
            <Button className="w-full">Register for Event</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventPreview;