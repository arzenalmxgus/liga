import { Calendar, MapPin, Users } from "lucide-react";
import { useState } from "react";
import EventPreview from "./EventPreview";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";

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
  const { user } = useAuth();

  // Fetch user profile to check role
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      const docRef = doc(db, 'profiles', user.uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    },
    enabled: !!user,
  });

  const handleCardClick = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view event details",
      });
      navigate("/auth");
      return;
    }

    // Allow both hosts and attendees to view event details
    if (userProfile?.user_role === 'host' || userProfile?.user_role === 'attendee') {
      console.log('Opening preview for user role:', userProfile.user_role);
      setIsPreviewOpen(true);
    } else {
      toast({
        title: "Access Denied",
        description: "You don't have permission to view event details",
        variant: "destructive",
      });
    }
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
          <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md">
            {category}
          </div>
        </div>
        <div className="p-6 space-y-4 bg-gradient-to-b from-gray-900/90 to-gray-900/95">
          <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
          <div className="space-y-3 text-gray-100">
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-2 backdrop-blur-sm">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{new Date(date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-2 backdrop-blur-sm">
              <MapPin className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium">{location}</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-2 backdrop-blur-sm">
              <Users className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">{current_participants} registered participants</span>
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