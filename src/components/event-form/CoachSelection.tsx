import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CoachSelectionProps {
  selectedCoachId: string;
  setSelectedCoachId: (value: string) => void;
  disabled?: boolean;
}

const CoachSelection = ({ selectedCoachId, setSelectedCoachId, disabled }: CoachSelectionProps) => {
  const { data: coaches } = useQuery({
    queryKey: ['coaches'],
    queryFn: async () => {
      const coachesRef = collection(db, 'profiles');
      const q = query(coachesRef, where('role', '==', 'coach'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="coach" className="text-white">Assign Sports Coach (Optional)</Label>
      <Select
        value={selectedCoachId}
        onValueChange={setSelectedCoachId}
        disabled={disabled}
      >
        <SelectTrigger className="w-full bg-white/90 text-black border-gray-200">
          <SelectValue placeholder="Select a coach" />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-200 text-black z-50">
          <SelectItem value="no_coach">No coach assigned</SelectItem>
          {coaches?.map((coach: any) => (
            <SelectItem key={coach.id} value={coach.id}>
              {coach.firstName} {coach.lastName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CoachSelection;