import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParticipantsListProps {
  eventId: string;
}

const ParticipantsList = ({ eventId }: ParticipantsListProps) => {
  const { toast } = useToast();

  const { data: participants, isLoading, refetch } = useQuery({
    queryKey: ['event-participants', eventId],
    queryFn: async () => {
      const participantsRef = collection(db, 'event_participants');
      const q = query(participantsRef, where('eventId', '==', eventId));
      const snapshot = await getDocs(q);
      
      const participantsData = [];
      for (const doc of snapshot.docs) {
        const userData = await getDocs(query(
          collection(db, 'profiles'),
          where('userId', '==', doc.data().userId)
        ));
        
        if (!userData.empty) {
          const profile = userData.docs[0].data();
          participantsData.push({
            id: doc.id,
            status: doc.data().status || 'pending',
            displayName: profile.displayName || 'N/A',
            email: profile.email || 'N/A',
            registrationDate: doc.data().registrationDate,
          });
        }
      }
      return participantsData;
    },
  });

  const handleStatusUpdate = async (participantId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const participantRef = doc(db, 'event_participants', participantId);
      await updateDoc(participantRef, { status: newStatus });
      await refetch();
      
      toast({
        title: `Participant ${newStatus}`,
        description: `The participant has been ${newStatus} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update participant status.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-white">Loading participants...</div>;
  }

  if (!participants?.length) {
    return <div className="text-gray-400">No participants registered yet.</div>;
  }

  return (
    <div className="space-y-4">
      {participants.map((participant) => (
        <div 
          key={participant.id} 
          className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
        >
          <div className="space-y-1">
            <h4 className="font-medium text-white">{participant.displayName}</h4>
            <p className="text-sm text-gray-400">{participant.email}</p>
            <p className="text-sm text-gray-400">
              Registered: {new Date(participant.registrationDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            {participant.status === 'pending' && (
              <>
                <Button
                  onClick={() => handleStatusUpdate(participant.id, 'approved')}
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(participant.id, 'rejected')}
                  variant="destructive"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            {participant.status === 'approved' && (
              <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
                Approved
              </span>
            )}
            {participant.status === 'rejected' && (
              <span className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm">
                Rejected
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParticipantsList;