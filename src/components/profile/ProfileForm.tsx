import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import SocialLinksSection from "./SocialLinksSection";
import BasicInfoSection from "./form-sections/BasicInfoSection";
import ContactInfoSection from "./form-sections/ContactInfoSection";
import { uploadProfilePicture, flattenObject } from "@/utils/profileUtils";
import type { SocialLinks, ProfileFormData } from "@/types/profile";
import { Loader2 } from "lucide-react";

interface ProfileFormProps {
  user: any;
  onCancel: () => void;
  socialLinks: SocialLinks;
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLinks>>;
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
  const [uploadingImage, setUploadingImage] = useState(false);
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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let photoURL = user.photoURL;

      if (profilePicture) {
        setUploadingImage(true);
        toast({
          title: "Uploading Image",
          description: "Please wait while we upload your profile picture...",
        });
        photoURL = await uploadProfilePicture(user.uid, profilePicture);
        setUploadingImage(false);
      }

      const updateData: ProfileFormData = {
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
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // If document doesn't exist, create it
        await setDoc(userRef, {
          ...flattenObject(updateData),
          createdAt: new Date().toISOString(),
        });
      } else {
        // If document exists, update it
        await updateDoc(userRef, flattenObject(updateData));
      }

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
      setUploadingImage(false);
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
        handleFileChange={(e) => {
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
            setPreviewUrl(URL.createObjectURL(file));
          }
        }}
        uploadingImage={uploadingImage}
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
          disabled={loading || uploadingImage}
          className="bg-black/20 text-white hover:bg-black/40 border-gray-700"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading || uploadingImage}
          className="min-w-[100px]"
        >
          {(loading || uploadingImage) ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {uploadingImage ? "Uploading..." : "Saving..."}
            </span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;