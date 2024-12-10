import { Calendar, MapPin, Users } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  category: string;
  participants: number;
  image: string;
}

const EventCard = ({ title, date, location, category, participants, image }: EventCardProps) => {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
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
  );
};

export default EventCard;