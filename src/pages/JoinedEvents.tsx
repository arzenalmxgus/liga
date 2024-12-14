import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import EventCard from "@/components/EventCard";
import { useToast } from "@/hooks/use-toast";

const JoinedEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: joinedEvents, isLoading } = useQuery({
    queryKey: ['joined-events', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      
      // First, get all event registrations for the user
      const registrationsRef = collection(db, 'event_participants');
      const registrationsQuery = query(registrationsRef, where('userId', '==', user.uid));
      const registrationsSnapshot = await getDocs(registrationsQuery);
      
      // Get the event IDs from the registrations
      const eventIds = registrationsSnapshot.docs.map(doc => doc.data().eventId);
      
      if (eventIds.length === 0) return [];

      // Then fetch the actual events
      const eventsRef = collection(db, 'events');
      const eventsQuery = query(eventsRef, where('id', 'in', eventIds));
      const eventsSnapshot = await getDocs(eventsQuery);
      
      return eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },
    enabled: !!user,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching joined events:', error);
        toast({
          title: "Error",
          description: "Failed to load your joined events. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="text-white text-center">Loading your joined events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="md:ml-16 pb-16 md:pb-0">
        <header className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">Joined Events</h1>
          <p className="text-gray-400 mt-1">Events you have registered for</p>
        </header>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {joinedEvents && joinedEvents.length > 0 ? (
            joinedEvents.map((event: any) => (
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
                hostId={event.hostId}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-12">
              You haven't joined any events yet.
              <br />
              Browse available events to get started!
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JoinedEvents;