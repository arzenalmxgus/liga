import { useState } from "react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import PublicProfile from "@/components/profile/PublicProfile";
import ProfileForm from "@/components/profile/ProfileForm";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!isEditing) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="md:ml-16 pb-16 md:pb-0">
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="bg-black/20 text-white hover:bg-black/40 border-gray-700"
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
            <PublicProfile
              displayName={user?.displayName || ""}
              email={user?.email || ""}
              photoURL={user?.photoURL}
              bio=""
              role="Host"
              eventsHosted={0}
              eventsAttended={0}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="md:ml-16 pb-16 md:pb-0">
        <div className="max-w-4xl mx-auto p-6">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
          </header>
          <ProfileForm user={user} onCancel={() => setIsEditing(false)} />
        </div>
      </main>
    </div>
  );
};

export default Profile;