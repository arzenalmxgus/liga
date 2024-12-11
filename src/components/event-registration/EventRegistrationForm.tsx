import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc, increment } from "firebase/firestore";
import { uploadImageToSupabase } from "@/utils/uploadUtils";
import { Loader2 } from "lucide-react";
import PersonalInfoSection from "./PersonalInfoSection";
import AcademicInfoSection from "./AcademicInfoSection";
import DocumentsSection from "./DocumentsSection";

interface EventRegistrationFormProps {
  eventId: string;
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const EventRegistrationForm = ({ eventId, userId, onSuccess, onCancel }: EventRegistrationFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, eventType: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof files) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file under 5MB",
          variant: "destructive",
        });
        return;
      }
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasEmptyFields = Object.values(formData).some(value => value === "");
    const hasEmptyFiles = Object.values(files).some(file => file === null);
    
    if (hasEmptyFields || hasEmptyFiles) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields and upload all required documents.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const uploadPromises = [];
      for (const [key, file] of Object.entries(files)) {
        if (file) {
          uploadPromises.push(
            uploadImageToSupabase(file, `registrations/${eventId}`).then(url => [key, url])
          );
        }
      }
      const uploadedFiles = Object.fromEntries(await Promise.all(uploadPromises));

      const registrationData = {
        ...formData,
        ...uploadedFiles,
        eventId,
        userId,
        registrationDate: new Date().toISOString(),
      };

      await addDoc(collection(db, "event_participants"), registrationData);
      await updateDoc(doc(db, "events", eventId), {
        currentParticipants: increment(1)
      });

      toast({
        title: "Success",
        description: "Registration submitted successfully",
      });
      onSuccess();
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PersonalInfoSection 
        formData={formData}
        handleInputChange={handleInputChange}
      />
      
      <AcademicInfoSection 
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
      />
      
      <DocumentsSection 
        handleFileChange={handleFileChange}
      />

      <div className="flex justify-end space-x-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="bg-white/20 hover:bg-white/30 text-white border-white/20"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
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