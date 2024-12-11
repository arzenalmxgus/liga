import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ProfileFormData, ProfileUpdateData } from "@/types/profile";

export const uploadProfilePicture = async (userId: string, file: File): Promise<string> => {
  const storageRef = ref(storage, `profile_pictures/${userId}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
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