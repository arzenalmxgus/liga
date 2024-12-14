import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import PublicProfile from "@/components/profile/PublicProfile";
import ProfileForm from "@/components/profile/ProfileForm";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    facebook: "",
    twitter: "",
    youtube: "",
    twitch: "",
    linkedin: "",
    github: "",
    discord: "",
    tiktok: "",
    pinterest: "",
  });

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      const userRef = doc(db, "profiles", user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    },
    enabled: !!user?.uid
  });

  useEffect(() => {
    if (profileData?.socialLinks) {
      setSocialLinks(profileData.socialLinks);
    }
  }, [profileData]);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <main className="md:ml-16 pb-16 md:pb-0">
          <div className="max-w-4xl mx-auto p-6">
            <div className="animate-pulse">
              <div className="h-32 bg-gray-700 rounded-lg mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                <Pencil className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
            <PublicProfile
              displayName={profileData?.displayName || user?.displayName || ""}
              realName={profileData?.realName || ""}
              email={user?.email || ""}
              photoURL={profileData?.photoURL || user?.photoURL}
              bio={profileData?.bio || ""}
              role={profileData?.role || "attendee"}
              city={profileData?.city}
              contactNumber={profileData?.contactNumber}
              eventsHosted={0}
              eventsAttended={0}
              socialLinks={socialLinks}
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
          <ProfileForm 
            user={user} 
            onCancel={() => setIsEditing(false)}
            socialLinks={socialLinks}
            setSocialLinks={setSocialLinks}
          />
        </div>
      </main>
    </div>
  );
};

export default Profile;