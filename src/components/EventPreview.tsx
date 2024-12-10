import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

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
  };
}

const EventPreview = ({ isOpen, onClose, event }: EventPreviewProps) => {
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
          <img src={event.image} alt={event.title} className="w-full h-64 object-cover rounded-lg" />
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
          <div className="mt-6">
            <Button className="w-full">Register for Event</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventPreview;