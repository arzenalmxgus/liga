import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import EventCard from "@/components/EventCard";

const MyEvents = () => {
  const { user } = useAuth();

  const { data: myEvents, isLoading } = useQuery({
    queryKey: ['my-events', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, where('hostId', '==', user.uid));
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
      <main className="md:ml-16 pb-16 md:pb-0">
        <header className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">My Events</h1>
          <p className="text-gray-400 mt-1">Manage your hosted events</p>
        </header>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myEvents?.map((event: any) => (
            <EventCard 
              key={event.id} 
              {...event}
              isHost={true} 
            />
          ))}
          {myEvents?.length === 0 && (
            <p className="text-white col-span-full text-center">You haven't created any events yet.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyEvents;