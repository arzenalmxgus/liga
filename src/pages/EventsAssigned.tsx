import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AssignedEventCard from "@/components/assigned-events/AssignedEventCard";

const EventsAssigned = () => {
  const { user } = useAuth();

  const { data: assignedEvents, isLoading } = useQuery({
    queryKey: ['assigned-events', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, where('coachId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },
    enabled: !!user,
  });

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="md:ml-16 p-6">
        <h1 className="text-3xl font-bold mb-6 text-white">Events Assigned to You</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedEvents?.map((event: any) => (
            <AssignedEventCard key={event.id} event={event} />
          ))}
          {assignedEvents?.length === 0 && (
            <p className="text-white col-span-full text-center">No events assigned to you yet.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventsAssigned;