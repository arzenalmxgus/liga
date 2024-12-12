import { useState } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticipantsList from "./ParticipantsList";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AssignedEventCardProps {
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    banner_photo: string;
    current_participants: number;
  };
}

const AssignedEventCard = ({ event }: AssignedEventCardProps) => {
  const [showParticipants, setShowParticipants] = useState(false);

  return (
    <>
      <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48">
          <img 
            src={event.banner_photo} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 space-y-4 bg-gradient-to-b from-gray-900/90 to-gray-900/95">
          <h3 className="text-xl font-semibold text-white">{event.title}</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-200">
              <Calendar className="w-5 h-5" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-200">
              <MapPin className="w-5 h-5" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-200">
              <Users className="w-5 h-5" />
              <span>{event.current_participants} participants</span>
            </div>
          </div>
          <Button 
            onClick={() => setShowParticipants(true)}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Manage Participants
          </Button>
        </div>
      </div>

      <Dialog open={showParticipants} onOpenChange={setShowParticipants}>
        <DialogContent className="max-w-4xl bg-gray-900/95">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">{event.title} - Participants</DialogTitle>
          </DialogHeader>
          <ParticipantsList eventId={event.id} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssignedEventCard;