import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";

export const uploadRegistrationDoc = async (
  file: File,
  eventId: string,
  userId: string,
  docType: 'photo' | 'registrarCert' | 'psaCopy'
): Promise<string | null> => {
  try {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${docType}_${Math.random()}.${fileExt}`;
    const filePath = `${eventId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('registration-docs')
      .upload(filePath, file, {
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: `Failed to upload ${docType}. Please try again.`,
        variant: "destructive",
      });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('registration-docs')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    toast({
      title: "Upload Error",
      description: "An unexpected error occurred during upload.",
      variant: "destructive",
    });
    return null;
  }
};

export const saveRegistrationDocs = async (
  eventId: string,
  userId: string,
  urls: {
    photo?: string;
    registrarCert?: string;
    psaCopy?: string;
  }
) => {
  try {
    const { error } = await supabase
      .from('registration_documents')
      .insert({
        event_id: eventId,
        user_id: userId,
        photo_url: urls.photo,
        registrar_cert_url: urls.registrarCert,
        psa_copy_url: urls.psaCopy,
      });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error saving registration docs:', error);
    toast({
      title: "Error",
      description: "Failed to save document references. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};