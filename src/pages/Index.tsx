import Navigation from "@/components/Navigation";
import EventsGrid from "@/components/EventsGrid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateEventForm from "@/components/CreateEventForm";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const { user } = useAuth();

  // Query to check if user is a host
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.uid],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', user.uid)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const isHost = profile?.user_role === 'host';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="md:ml-16 pb-16 md:pb-0">
        <header className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Upcoming Events</h1>
            <p className="text-gray-400 mt-1">Discover and join exciting events</p>
          </div>
          {user && isHost && (
            <Button onClick={() => setIsCreateEventOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          )}
        </header>
        <EventsGrid />
        <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <CreateEventForm onSuccess={() => setIsCreateEventOpen(false)} />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Index;