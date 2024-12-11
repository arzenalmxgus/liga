import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

interface PublicProfileProps {
  displayName: string;
  email: string;
  photoURL: string | null;
  bio: string;
  role: string;
  eventsHosted?: number;
  eventsAttended?: number;
}

const PublicProfile = ({
  displayName,
  email,
  photoURL,
  bio,
  role,
  eventsHosted = 0,
  eventsAttended = 0,
}: PublicProfileProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-black/20 border-gray-800">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-24 h-24">
            {photoURL ? (
              <AvatarImage src={photoURL} alt={displayName} />
            ) : (
              <AvatarFallback className="bg-gray-700">
                <User className="w-12 h-12 text-gray-400" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{displayName}</h2>
            <p className="text-gray-400">{email}</p>
            <div className="mt-2">
              <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-purple-600 rounded-full">
                {role}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-2">About</h3>
          <p className="text-gray-300">{bio || "No bio available"}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-black/30 rounded-lg">
            <div className="text-2xl font-bold text-white">{eventsHosted}</div>
            <div className="text-sm text-gray-400">Events Hosted</div>
          </div>
          <div className="text-center p-4 bg-black/30 rounded-lg">
            <div className="text-2xl font-bold text-white">{eventsAttended}</div>
            <div className="text-sm text-gray-400">Events Attended</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PublicProfile;