import { useQuery } from "@tanstack/react-query";
import EventCard from "./EventCard";
import { supabase } from "@/lib/supabase";

const EventsGrid = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading events...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {events?.map((event) => (
        <EventCard key={event.id} {...event} />
      ))}
    </div>
  );
};

export default EventsGrid;