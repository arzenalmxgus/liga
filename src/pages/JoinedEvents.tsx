import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import EventCard from "@/components/EventCard";

const JoinedEvents = () => {
  const { user } = useAuth();

  const { data: joinedEvents, isLoading } = useQuery({
    queryKey: ['joined-events', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      const eventsRef = collection(db, 'registrations');
      const q = query(eventsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      // Get all event IDs from registrations
      const eventIds = querySnapshot.docs.map(doc => doc.data().eventId);
      
      // Fetch event details for each registration
      const events = await Promise.all(
        eventIds.map(async (eventId) => {
          const eventDoc = await getDocs(query(collection(db, 'events'), where('id', '==', eventId)));
          const eventData = eventDoc.docs[0]?.data();
          return eventData ? { id: eventId, ...eventData } : null;
        })
      );
      
      return events.filter(event => event !== null);
    },
    enabled: !!user,
  });

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <main className="md:ml-16 pb-16 md:pb-0">
        <header className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">Joined Events</h1>
          <p className="text-gray-400 mt-1">Events you have registered for</p>
        </header>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {joinedEvents?.map((event: any) => (
            <EventCard 
              key={event.id} 
              {...event}
            />
          ))}
          {joinedEvents?.length === 0 && (
            <p className="text-white col-span-full text-center">You haven't joined any events yet.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default JoinedEvents;