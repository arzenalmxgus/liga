import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import RegistrationButton from "./RegistrationButton";

interface EventActionsProps {
  eventId: string;
  isHost: boolean;
  isRegistered: boolean;
  isFull: boolean;
  onRegister: () => void;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

const EventActions = ({ 
  eventId, 
  isHost, 
  isRegistered, 
  isFull, 
  onRegister, 
  onClose,
  onDelete 
}: EventActionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleUnregister = async () => {
    if (!user?.uid) return;

    try {
      const registrationsRef = collection(db, 'event_participants');
      const q = query(
        registrationsRef,
        where('eventId', '==', eventId),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        await deleteDoc(snapshot.docs[0].ref);
        
        toast({
          title: "Success",
          description: "You have successfully unregistered from this event.",
        });

        queryClient.invalidateQueries({ queryKey: ['event-registration'] });
        queryClient.invalidateQueries({ queryKey: ['joined-events'] });
        queryClient.invalidateQueries({ queryKey: ['events'] });
        
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
    <div className="flex gap-4">
      {!isHost && !isRegistered && (
        <RegistrationButton
          isHost={isHost}
          isFull={isFull}
          onRegister={onRegister}
        />
      )}
      {!isHost && isRegistered && (
        <Button 
          onClick={handleUnregister}
          variant="destructive"
          className="flex-1 w-full"
        >
          Unregister from Event
        </Button>
      )}
      {isHost && (
        <Button onClick={onDelete} variant="destructive">
          Delete Event
        </Button>
      )}
    </div>
  );
};

export default EventActions;