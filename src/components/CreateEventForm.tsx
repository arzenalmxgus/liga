import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { uploadImageToSupabase } from "@/utils/uploadUtils";
import { Loader2 } from "lucide-react";
import EventBasicInfo from "./event-form/EventBasicInfo";
import EventRequirements from "./event-form/EventRequirements";
import CoachSelection from "./event-form/CoachSelection";
import AdditionalInfo from "./event-form/AdditionalInfo";

interface CreateEventFormProps {
  onSuccess?: () => void;
}

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=80";

const CreateEventForm = ({ onSuccess }: CreateEventFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [date, setDate] = useState<Date>();
  const [requireAdditionalInfo, setRequireAdditionalInfo] = useState(false);
  const [selectedCoachId, setSelectedCoachId] = useState<string>("no_coach");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    participantsLimit: "",
    entranceFee: "",
    isFree: "true",
    requiresAdditionalInfo: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      setBannerFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create an event",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      toast({
        title: "Date required",
        description: "Please select an event date",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let downloadURL = DEFAULT_BANNER;
      
      if (bannerFile) {
        const uploadedUrl = await uploadImageToSupabase(bannerFile, 'events');
        if (uploadedUrl) {
          downloadURL = uploadedUrl;
        }
      }

      const eventData = {
        ...formData,
        date: date.toISOString(),
        bannerPhoto: downloadURL,
        hostId: user.uid,
        coachId: selectedCoachId === "no_coach" ? null : selectedCoachId,
        createdAt: new Date().toISOString(),
        currentParticipants: 0,
        requiresAdditionalInfo: requireAdditionalInfo,
      };

      await addDoc(collection(db, "events"), eventData);

      toast({
        title: "Success",
        description: "Event created successfully",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      navigate("/events");
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="banner" className="text-white">Banner Photo (Optional)</Label>
        <Input
          id="banner"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="cursor-pointer bg-white/10 text-white"
          disabled={loading}
        />
        <p className="text-sm text-gray-400 mt-1">
          If no banner is uploaded, a default image will be used
        </p>
      </div>

      <EventBasicInfo
        formData={formData}
        handleInputChange={handleInputChange}
        date={date}
        setDate={setDate}
        disabled={loading}
      />

      <CoachSelection
        selectedCoachId={selectedCoachId}
        setSelectedCoachId={setSelectedCoachId}
        disabled={loading}
      />

      <AdditionalInfo
        requireAdditionalInfo={requireAdditionalInfo}
        setRequireAdditionalInfo={setRequireAdditionalInfo}
        setFormData={setFormData}
      />

      <EventRequirements
        formData={formData}
        handleInputChange={handleInputChange}
        disabled={loading}
      />

      <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Event...
          </>
        ) : (
          'Create Event'
        )}
      </Button>
    </form>
  );
};

export default CreateEventForm;