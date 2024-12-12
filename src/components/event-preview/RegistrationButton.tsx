import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface RegistrationButtonProps {
  isHost: boolean;
  isFull: boolean;
  onRegister: () => void;
}

const RegistrationButton = ({ isHost, isFull, onRegister }: RegistrationButtonProps) => {
  const { user } = useAuth();

  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      const docRef = collection(db, 'profiles');
      const q = query(docRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : snapshot.docs[0].data();
    },
    enabled: !!user?.uid,
  });

  const isCoach = userProfile?.role === 'coach';

  if (isHost || isCoach) return null;

  return (
    <Button 
      className="flex-1 bg-primary hover:bg-primary/90 text-white"
      onClick={onRegister}
      disabled={isFull}
    >
      {isFull ? "Event Full" : "Register for Event"}
    </Button>
  );
};

export default RegistrationButton;