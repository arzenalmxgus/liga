import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateEventForm from "@/components/CreateEventForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Database } from "@/lib/database.types";

type Event = Database['public']['Tables']['events']['Row'];

const MyEvents = () => {
  const { user } = useAuth();
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const isMobile = useIsMobile();

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ['host-events', user?.uid],
    queryFn: async () => {
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, where('host_id', '==', user?.uid));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
    },
    enabled: !!user,
  });

  if (isLoading) {
    return <div className="p-6 text-white">Loading events...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">My Events</h1>
        <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-white/20 hover:bg-white/30 text-white">
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className={`${
            isMobile 
              ? 'w-[95%] max-h-[80vh]' 
              : 'w-[90%] max-w-[1200px] max-h-[85vh]'
          } overflow-y-auto p-6 bg-gray-900/95 border border-white/20 text-white`}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Create New Event</DialogTitle>
            </DialogHeader>
            <CreateEventForm onSuccess={() => {
              setIsCreateEventOpen(false);
              refetch();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            description={event.description || ''}
            entrance_fee={event.entrance_fee}
            is_free={event.is_free}
            hostId={event.host_id}
            isHost={true}
          />
        ))}
        {events?.length === 0 && (
          <p className="text-gray-400 col-span-full text-center py-12">
            You haven't created any events yet. Click the "Create Event" button to get started.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyEvents;