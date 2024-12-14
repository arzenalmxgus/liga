import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import PersonalInfoSection from "./PersonalInfoSection";
import AcademicInfoSection from "./AcademicInfoSection";
import DocumentsSection from "./DocumentsSection";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  checkExistingRegistration, 
  uploadRegistrationFiles,
  submitRegistration,
  type RegistrationFormData,
  type RegistrationFiles 
} from "@/utils/eventRegistrationUtils";

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
  const [formData, setFormData] = useState<RegistrationFormData>({
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

  const [files, setFiles] = useState<RegistrationFiles>({
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof RegistrationFiles) => {
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

  const validateForm = () => {
    const requiredFields = requiresAdditionalInfo 
      ? Object.values(formData)
      : [formData.name, formData.dateOfBirth, formData.age, formData.nationality];
      
    const hasEmptyRequiredFields = requiredFields.some(value => value === "");
    const hasEmptyRequiredFiles = requiresAdditionalInfo && Object.values(files).some(file => file === null);
    
    if (hasEmptyRequiredFields || hasEmptyRequiredFiles) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for this event",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Check if user is already registered
      const isRegistered = await checkExistingRegistration(eventId, userId);
      if (isRegistered) {
        toast({
          title: "Already Registered",
          description: "You have already registered for this event.",
          variant: "destructive",
        });
        return;
      }

      // Upload files if required
      const uploadedFiles = requiresAdditionalInfo 
        ? await uploadRegistrationFiles(files, eventId)
        : {};

      // Submit registration
      await submitRegistration(formData, uploadedFiles, eventId, userId);

      toast({
        title: "Success",
        description: "Registration submitted successfully",
      });
      onSuccess();
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Failed to submit registration.";
      
      if (error.code === "permission-denied") {
        errorMessage = "You don't have permission to register for this event. Please make sure you're logged in with the correct account.";
      } else if (error.code === "not-found") {
        errorMessage = "Event not found or has been removed.";
      } else if (error.code === "already-exists") {
        errorMessage = "You have already registered for this event.";
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
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
      
      {requiresAdditionalInfo && (
        <>
          <AcademicInfoSection 
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
          
          <DocumentsSection 
            handleFileChange={handleFileChange}
          />
        </>
      )}

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