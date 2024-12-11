import { useQuery } from "@tanstack/react-query";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface Attendee {
  id: string;
  displayName: string;
  realName: string;
  photoURL: string;
  bio: string;
}

const AttendeesList = () => {
  const { data: attendees, isLoading } = useQuery({
    queryKey: ['attendees'],
    queryFn: async () => {
      const attendeesRef = collection(db, 'profiles');
      const q = query(attendeesRef);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Attendee[];
    }
  });

  if (isLoading) return <div>Loading attendees...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Event Attendees</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attendees?.map((attendee) => (
          <Card key={attendee.id} className="p-4 bg-black/20 border-gray-700">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={attendee.photoURL} />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-white font-medium">{attendee.displayName}</h3>
                <p className="text-sm text-gray-400">{attendee.realName}</p>
              </div>
            </div>
            {attendee.bio && (
              <p className="mt-2 text-sm text-gray-300 line-clamp-2">{attendee.bio}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AttendeesList;