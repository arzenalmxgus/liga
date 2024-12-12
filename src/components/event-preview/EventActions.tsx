import { Button } from "../ui/button";
import DeleteEventButton from "./DeleteEventButton";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface EventActionsProps {
  isHost: boolean;
  isFull: boolean;
  onRegister: () => void;
  onDelete: () => Promise<void>;
}

const EventActions = ({ isHost, isFull, onRegister, onDelete }: EventActionsProps) => {
  const { user } = useAuth();

  // Query to get user's role
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      const q = query(collection(db, 'profiles'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : snapshot.docs[0].data();
    },
    enabled: !!user?.uid,
  });

  const isCoach = userProfile?.role === 'coach';

  return (
    <div className="flex gap-4">
      {!isHost && !isCoach && (
        <Button 
          className="flex-1 bg-primary hover:bg-primary/90 text-white"
          onClick={onRegister}
          disabled={isFull}
        >
          {isFull ? "Event Full" : "Register for Event"}
        </Button>
      )}
      
      {isHost && (
        <DeleteEventButton onDelete={onDelete} />
      )}
    </div>
  );
};

export default EventActions;