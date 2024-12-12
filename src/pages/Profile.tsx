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

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: "",
    realName: "",
    bio: "",
    city: "",
    contactNumber: "",
    role: "",
    photoURL: null,
  });
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

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.uid) return;
      try {
        console.log("Fetching profile data for user:", user.uid);
        const userRef = doc(db, "profiles", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log("Retrieved profile data:", data);
          setProfileData({
            displayName: data.displayName || "",
            realName: data.realName || "",
            bio: data.bio || "",
            city: data.city || "",
            contactNumber: data.contactNumber || "",
            role: data.role || "",
            photoURL: data.photoURL || null,
          });
          if (data.socialLinks) {
            setSocialLinks(data.socialLinks);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      }
    };
    fetchProfileData();
  }, [user, toast]);

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
              displayName={profileData.displayName || user?.displayName || ""}
              realName={profileData.realName}
              email={user?.email || ""}
              photoURL={profileData.photoURL || user?.photoURL}
              bio={profileData.bio}
              role={profileData.role}
              city={profileData.city}
              contactNumber={profileData.contactNumber}
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