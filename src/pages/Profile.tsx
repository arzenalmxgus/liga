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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import PublicProfile from "@/components/profile/PublicProfile";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("Host");
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
        bio,
        role,
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
    <div className="min-h-screen">
      <Navigation />
      <main className="md:ml-16 pb-16 md:pb-0">
        <div className="max-w-4xl mx-auto p-6">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : <><Pencil className="w-4 h-4 mr-2" /> Edit Profile</>}
            </Button>
          </header>

          <Tabs defaultValue="edit" className="space-y-6">
            <TabsList className="bg-black/20 border-gray-800">
              <TabsTrigger value="edit" className="text-white">Edit Profile</TabsTrigger>
              <TabsTrigger value="preview" className="text-white">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="edit">
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
                        className="text-white"
                      />
                      <p className="text-sm text-gray-400 mt-1">
                        Recommended: Square image, max 2MB
                      </p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="displayName" className="text-white">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={!isEditing}
                      className="text-white bg-black/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-white">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      disabled={!isEditing}
                      className="text-white bg-black/20 min-h-[100px]"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
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
            </TabsContent>

            <TabsContent value="preview">
              <PublicProfile
                displayName={displayName}
                email={user?.email || ""}
                photoURL={user?.photoURL}
                bio={bio}
                role={role}
                eventsHosted={0}
                eventsAttended={0}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;