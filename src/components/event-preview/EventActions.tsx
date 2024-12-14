import { Button } from "../ui/button";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface EventActionsProps {
  eventId: string;
  isHost?: boolean;
  isRegistered: boolean;
  isFull: boolean;
  onRegister: () => void;
  onClose: () => void;
  onDelete: () => void;
}

const EventActions = ({
  eventId,
  isHost,
  isRegistered,
  isFull,
  onRegister,
  onClose,
  onDelete,
}: EventActionsProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleUnregister = async () => {
    try {
      const registrationsRef = collection(db, 'event_participants');
      const q = query(registrationsRef, where('eventId', '==', eventId));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        await deleteDoc(snapshot.docs[0].ref);
        
        queryClient.invalidateQueries({ queryKey: ['event-registration'] });
        queryClient.invalidateQueries({ queryKey: ['event-participants'] });
        queryClient.invalidateQueries({ queryKey: ['joined-events'] });
        
        toast({
          title: "Success",
          description: "You have been unregistered from this event.",
        });
        
        onClose();
      }
    } catch (error) {
      console.error('Error unregistering from event:', error);
      toast({
        title: "Error",
        description: "Failed to unregister from the event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 w-full">
      {isHost ? (
        <Button
          variant="destructive"
          className="w-full"
          onClick={onDelete}
        >
          Delete Event
        </Button>
      ) : (
        <>
          {isRegistered ? (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleUnregister}
            >
              Unregister from Event
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={onRegister}
              disabled={isFull}
            >
              {isFull ? "Event is Full" : "Register for Event"}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default EventActions;