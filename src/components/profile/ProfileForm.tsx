import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import SocialLinksSection from "./SocialLinksSection";

interface ProfileFormProps {
  user: any;
  onCancel: () => void;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
  };
  setSocialLinks: React.Dispatch<React.SetStateAction<{
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
  }>>;
}

const ProfileForm = ({ user, onCancel, socialLinks, setSocialLinks }: ProfileFormProps) => {
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("Host");
  const [city, setCity] = useState("");
  const [contactNumber, setContactNumber] = useState("");
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
        city,
        contactNumber,
        socialLinks,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      onCancel();
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
    <form onSubmit={handleProfileUpdate} className="space-y-6">
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
      </div>

      <div>
        <Label htmlFor="displayName" className="text-white">Display Name</Label>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="text-white bg-black/20"
        />
      </div>

      <div>
        <Label htmlFor="bio" className="text-white">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="text-white bg-black/20 min-h-[100px]"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div>
        <Label htmlFor="city" className="text-white">Current City</Label>
        <Input
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="text-white bg-black/20"
          placeholder="Enter your current city"
        />
      </div>

      <div>
        <Label htmlFor="contactNumber" className="text-white">Contact Number</Label>
        <Input
          id="contactNumber"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          className="text-white bg-black/20"
          placeholder="Enter your contact number"
        />
      </div>

      <div>
        <Label htmlFor="email" className="text-white">Email</Label>
        <Input
          id="email"
          value={user?.email || ""}
          disabled
          className="bg-black/20 text-white"
        />
      </div>

      <SocialLinksSection
        socialLinks={socialLinks}
        setSocialLinks={setSocialLinks}
      />

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="bg-black/20 text-white hover:bg-black/40 border-gray-700"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;