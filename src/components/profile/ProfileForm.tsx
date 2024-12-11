import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import SocialLinksSection from "./SocialLinksSection";
import BasicInfoSection from "./form-sections/BasicInfoSection";
import ContactInfoSection from "./form-sections/ContactInfoSection";

interface ProfileFormProps {
  user: any;
  onCancel: () => void;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
    twitch: string;
    linkedin: string;
    github: string;
    discord: string;
    tiktok: string;
    pinterest: string;
  };
  setSocialLinks: React.Dispatch<React.SetStateAction<{
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
    twitch: string;
    linkedin: string;
    github: string;
    discord: string;
    tiktok: string;
    pinterest: string;
  }>>;
}

interface UpdateData {
  displayName: string;
  realName: string;
  bio: string;
  role: string;
  city: string;
  contactNumber: string;
  socialLinks: ProfileFormProps['socialLinks'];
  updatedAt: string;
  photoURL?: string;
}

const ProfileForm = ({ user, onCancel, socialLinks, setSocialLinks }: ProfileFormProps) => {
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [realName, setRealName] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("Host");
  const [city, setCity] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.uid) return;
      try {
        const userRef = doc(db, "profiles", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setDisplayName(data.displayName || "");
          setRealName(data.realName || "");
          setBio(data.bio || "");
          setCity(data.city || "");
          setContactNumber(data.contactNumber || "");
          setRole(data.role || "Host");
          if (data.photoURL) {
            setPreviewUrl(data.photoURL);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        });
      }
    };
    fetchUserProfile();
  }, [user, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 2MB",
          variant: "destructive",
        });
        return;
      }

      setProfilePicture(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

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

      const updateData: UpdateData = {
        displayName,
        realName,
        bio,
        role,
        city,
        contactNumber,
        socialLinks,
        updatedAt: new Date().toISOString(),
      };

      if (photoURL) {
        updateData.photoURL = photoURL;
      }

      const userRef = doc(db, "profiles", user.uid);
      await updateDoc(userRef, updateData);

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      onCancel();
    } catch (error) {
      console.error("Error updating profile:", error);
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
      <BasicInfoSection
        displayName={displayName}
        setDisplayName={setDisplayName}
        realName={realName}
        setRealName={setRealName}
        previewUrl={previewUrl}
        handleFileChange={handleFileChange}
      />

      <ContactInfoSection
        bio={bio}
        setBio={setBio}
        city={city}
        setCity={setCity}
        contactNumber={contactNumber}
        setContactNumber={setContactNumber}
        email={user?.email || ""}
      />

      <SocialLinksSection
        socialLinks={socialLinks}
        setSocialLinks={setSocialLinks}
      />

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
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