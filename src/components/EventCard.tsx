import { Calendar, MapPin, Users } from "lucide-react";
import { useState } from "react";
import EventPreview from "./EventPreview";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  category: string;
  participants: number;
  image: string;
}

const EventCard = ({ title, date, location, category, participants, image }: EventCardProps) => {
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
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4 bg-accent px-3 py-1 rounded-full text-xs font-semibold">
            {category}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
          <div className="space-y-2 text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">{participants} participants</span>
            </div>
          </div>
        </div>
      </div>
      <EventPreview 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        event={{ title, date, location, category, participants, image }}
      />
    </>
  );
};

export default EventCard;