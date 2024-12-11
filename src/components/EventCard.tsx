import { Calendar, MapPin, Users } from "lucide-react";
import { useState } from "react";
import EventPreview from "./EventPreview";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  participants_limit: number;
  current_participants: number;
  banner_photo: string;
  description: string;
  entrance_fee: number | null;
  is_free: boolean;
  hostId: string;
}

const EventCard = ({ 
  id,
  title, 
  date, 
  location, 
  category, 
  participants_limit,
  current_participants,
  banner_photo,
  description,
  entrance_fee,
  is_free,
  hostId,
}: EventCardProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // This is a mock function - replace with actual auth check
  const isLoggedIn = () => false;

  const handleCardClick = () => {
    if (!isLoggedIn()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view event details",
      });
      navigate("/auth");
      return;
    }
    setIsPreviewOpen(true);
  };

  return (
    <>
      <div 
        className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative h-48 overflow-hidden">
          <img 
            src={banner_photo} 
            alt={title} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          <div className="absolute top-4 right-4 bg-accent px-3 py-1 rounded-full text-xs font-semibold">
            {category}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
          <div className="space-y-2 text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">{current_participants}/{participants_limit} participants</span>
            </div>
          </div>
        </div>
      </div>
      <EventPreview 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        event={{ 
          id,
          title, 
          date, 
          location, 
          category, 
          participants: current_participants,
          image: banner_photo,
          description,
          entrance_fee,
          is_free,
          participants_limit,
          hostId
        }}
      />
    </>
  );
};

export default EventCard;