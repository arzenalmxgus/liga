import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import EventCard from "../EventCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Calendar, Filter } from "lucide-react";
import { DatePicker } from "../ui/date-picker";

interface Event {
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
}

const StudentDashboard = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', searchTerm, selectedDate, selectedCategory],
    queryFn: async () => {
      const eventsRef = collection(db, 'events');
      let q = query(eventsRef);
      
      if (selectedCategory) {
        q = query(q, where('category', '==', selectedCategory));
      }
      
      const querySnapshot = await getDocs(q);
      let filteredEvents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];

      if (searchTerm) {
        filteredEvents = filteredEvents.filter(event => 
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedDate) {
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === selectedDate.toDateString();
        });
      }

      return filteredEvents;
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 p-6">
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <DatePicker
            selected={selectedDate}
            onSelect={setSelectedDate}
            placeholder="Select date"
          />
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            setSearchTerm("");
            setSelectedDate(undefined);
            setSelectedCategory("");
          }}
        >
          <Filter className="w-4 h-4" />
          Clear Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {events?.map((event) => (
          <EventCard
            key={event.id}
            {...event}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;