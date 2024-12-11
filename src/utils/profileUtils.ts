import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ProfileFormData, ProfileUpdateData } from "@/types/profile";

export const uploadProfilePicture = async (userId: string, file: File): Promise<string> => {
  // Create a reference to the file location in Firebase Storage
  const storageRef = ref(storage, `profile_pictures/${userId}/${Date.now()}-${file.name}`);
  
  // Upload the file
  const snapshot = await uploadBytes(storageRef, file);
  
  // Get the download URL
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
};

export const flattenObject = (obj: ProfileFormData): ProfileUpdateData => {
  const flattened: ProfileUpdateData = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    if (key === 'socialLinks' && typeof value === 'object') {
      Object.entries(value).forEach(([socialKey, socialValue]) => {
        flattened[`socialLinks.${socialKey}`] = socialValue;
      });
    } else {
      flattened[key] = value;
    }
  });
  
  return flattened;
};