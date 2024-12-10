import { useQuery } from "@tanstack/react-query";
import EventCard from "./EventCard";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

const EventsGrid = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading events...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {events?.map((event) => (
        <EventCard 
          key={event.id}
          id={event.id}
          title={event.title}
          date={event.date}
          location={event.location}
          category={event.category}
          participants_limit={event.participants_limit}
          current_participants={event.current_participants}
          banner_photo={event.banner_photo}
          description={event.description}
          entrance_fee={event.entrance_fee}
          is_free={event.is_free}
        />
      ))}
    </div>
  );
};

export default EventsGrid;