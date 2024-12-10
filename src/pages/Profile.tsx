import { useState } from "react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let photoURL = user.photoURL;

      if (profilePicture) {
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(storageRef, profilePicture);
        photoURL = await getDownloadURL(storageRef);
      }

      const userRef = doc(db, "profiles", user.uid);
      await updateDoc(userRef, {
        displayName,
        photoURL,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="md:ml-16 pb-16 md:pb-0">
        <div className="max-w-2xl mx-auto p-6">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Profile</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : <><Pencil className="w-4 h-4 mr-2" /> Edit Profile</>}
            </Button>
          </header>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              {isEditing && (
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Recommended: Square image, max 2MB
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              {isEditing && (
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Save Changes"}
                </Button>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;