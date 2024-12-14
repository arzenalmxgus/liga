import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import PersonalInfoSection from "./PersonalInfoSection";
import AcademicInfoSection from "./AcademicInfoSection";
import DocumentsSection from "./DocumentsSection";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadRegistrationDoc, saveRegistrationDocs } from "@/utils/uploadUtils";

interface EventRegistrationFormProps {
  eventId: string;
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const EventRegistrationForm = ({ 
  eventId, 
  userId, 
  onSuccess, 
  onCancel 
}: EventRegistrationFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    age: "",
    nationality: "",
    year: "",
    course: "",
    academicLoadUnits: "",
    yearsOfParticipation: "",
    highSchoolGradYear: "",
    eventType: "",
    school: "",
  });

  const [files, setFiles] = useState<{
    photo: File | null;
    registrarCert: File | null;
    psaCopy: File | null;
  }>({
    photo: null,
    registrarCert: null,
    psaCopy: null,
  });

  const { data: eventData } = useQuery({
    queryKey: ['event-details', eventId],
    queryFn: async () => {
      const eventDoc = await getDoc(doc(db, 'events', eventId));
      return eventDoc.exists() ? eventDoc.data() : null;
    },
  });

  const requiresAdditionalInfo = eventData?.requiresAdditionalInfo || false;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, eventType: value }));
  };

  const handleFileChange = (file: File | null, type: keyof typeof files) => {
    setFiles(prev => ({ ...prev, [type]: file }));
  };

  const uploadFiles = async () => {
    setIsUploading(true);
    const urls: Record<string, string> = {};

    try {
      if (files.photo) {
        const photoUrl = await uploadRegistrationDoc(files.photo, eventId, userId, 'photo');
        if (photoUrl) urls.photo = photoUrl;
      }

      if (files.registrarCert) {
        const registrarUrl = await uploadRegistrationDoc(files.registrarCert, eventId, userId, 'registrarCert');
        if (registrarUrl) urls.registrarCert = registrarUrl;
      }

      if (files.psaCopy) {
        const psaUrl = await uploadRegistrationDoc(files.psaCopy, eventId, userId, 'psaCopy');
        if (psaUrl) urls.psaCopy = psaUrl;
      }

      return urls;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Upload files first
      const uploadedUrls = await uploadFiles();
      
      // Save document references
      await saveRegistrationDocs(eventId, userId, uploadedUrls);

      // Create registration in Firebase
      const registrationId = `${eventId}_${userId}`;
      await setDoc(doc(db, "event_participants", registrationId), {
        ...formData,
        eventId,
        userId,
        status: 'pending',
        registrationDate: new Date().toISOString(),
        documents: uploadedUrls,
      });

      toast({
        title: "Success",
        description: "Registration submitted successfully",
      });
      onSuccess();
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for this event",
        variant: "destructive",
      });
      return false;
    }

    const requiredFields = requiresAdditionalInfo 
      ? Object.values(formData)
      : [formData.name, formData.dateOfBirth, formData.age, formData.nationality];
      
    if (requiredFields.some(value => !value)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    if (requiresAdditionalInfo && (!files.photo || !files.registrarCert || !files.psaCopy)) {
      toast({
        title: "Documents Required",
        description: "Please upload all required documents.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PersonalInfoSection 
        formData={formData}
        handleInputChange={handleInputChange}
      />
      
      {requiresAdditionalInfo && (
        <>
          <AcademicInfoSection 
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
          
          <DocumentsSection 
            handleFileChange={handleFileChange}
            isUploading={isUploading}
          />
        </>
      )}

      <div className="flex justify-end space-x-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading || isUploading}
          className="bg-white/20 hover:bg-white/30 text-white border-white/20"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading || isUploading}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          {(loading || isUploading) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isUploading ? 'Uploading...' : 'Submitting...'}
            </>
          ) : (
            'Submit Registration'
          )}
        </Button>
      </div>
    </form>
  );
};

export default EventRegistrationForm;