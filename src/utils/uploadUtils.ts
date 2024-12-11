import { supabase } from '@/lib/supabase';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadImageToSupabase = async (file: File, path: string): Promise<string> => {
  console.log('Uploading image to Supabase:', { fileName: file.name, fileSize: file.size });
  
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('event-images')
      .upload(filePath, file);

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    console.log('Supabase upload successful:', data);

    const { data: { publicUrl } } = supabase.storage
      .from('event-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImageToSupabase:', error);
    throw error;
  }
};

// Fallback to Firebase if needed
export const uploadImageToFirebase = async (file: File, path: string): Promise<string> => {
  console.log('Uploading image to Firebase:', { fileName: file.name, fileSize: file.size });
  
  try {
    const storageRef = ref(storage, `${path}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('Firebase upload successful:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error in uploadImageToFirebase:', error);
    throw error;
  }
};