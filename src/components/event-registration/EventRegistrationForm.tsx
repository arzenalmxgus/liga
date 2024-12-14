import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc, increment, getDoc, query, where, getDocs } from "firebase/firestore";
import { uploadImageToSupabase } from "@/utils/uploadUtils";
import { Loader2 } from "lucide-react";
import PersonalInfoSection from "./PersonalInfoSection";
import AcademicInfoSection from "./AcademicInfoSection";
import DocumentsSection from "./DocumentsSection";
import { useQuery } from "@tanstack/react-query";

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
    
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for this event",
        variant: "destructive",
      });
      return;
    }

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
      return;
    }

    setLoading(true);

    try {
      // Check if user is already registered
      const registrationsRef = collection(db, "event_participants");
      const existingRegQuery = query(
        registrationsRef,
        where("eventId", "==", eventId),
        where("userId", "==", userId)
      );
      const existingRegDocs = await getDocs(existingRegQuery);

      if (!existingRegDocs.empty) {
        toast({
          title: "Already Registered",
          description: "You have already registered for this event.",
          variant: "destructive",
        });
        return;
      }

      let uploadedFiles = {};
      
      if (requiresAdditionalInfo) {
        const uploadPromises = [];
        for (const [key, file] of Object.entries(files)) {
          if (file) {
            uploadPromises.push(
              uploadImageToSupabase(file, `registrations/${eventId}`).then(url => [key, url])
            );
          }
        }
        uploadedFiles = Object.fromEntries(await Promise.all(uploadPromises));
      }

      const registrationData = {
        ...formData,
        ...uploadedFiles,
        eventId,
        userId,
        status: 'pending',
        registrationDate: new Date().toISOString(),
      };

      await addDoc(collection(db, "event_participants"), registrationData);
      
      // Update event participants count
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
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
