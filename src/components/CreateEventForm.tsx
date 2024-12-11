import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { uploadImageToSupabase } from "@/utils/uploadUtils";
import { Loader2 } from "lucide-react";
import EventBasicInfo from "./event-form/EventBasicInfo";
import EventDateLocation from "./event-form/EventDateLocation";
import EventCapacityFee from "./event-form/EventCapacityFee";

interface CreateEventFormProps {
  onSuccess?: () => void;
}

const CreateEventForm = ({ onSuccess }: CreateEventFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    participantsLimit: "",
    entranceFee: "",
    isFree: "true",
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

    if (!bannerFile) {
      toast({
        title: "Banner required",
        description: "Please upload a banner image",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Starting event creation process...');
      
      // Upload image to Supabase
      console.log('Uploading banner to Supabase...');
      const downloadURL = await uploadImageToSupabase(bannerFile, 'events');
      console.log('Banner upload successful:', downloadURL);

      // Create event document in Firebase
      console.log('Creating event document in Firebase...');
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: date.toISOString(),
        location: formData.location,
        category: formData.category,
        participantsLimit: parseInt(formData.participantsLimit) || 0,
        entranceFee: formData.isFree === "true" ? null : parseFloat(formData.entranceFee) || 0,
        isFree: formData.isFree === "true",
        bannerPhoto: downloadURL,
        hostId: user.uid,
        createdAt: new Date().toISOString(),
        currentParticipants: 0,
      };

      const docRef = await addDoc(collection(db, "events"), eventData);
      console.log('Event created successfully:', docRef.id);

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
        <Label htmlFor="banner">Banner Photo</Label>
        <Input
          id="banner"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="cursor-pointer"
          disabled={loading}
        />
      </div>

      <EventBasicInfo
        formData={formData}
        handleInputChange={handleInputChange}
        disabled={loading}
      />

      <EventDateLocation
        date={date}
        setDate={setDate}
        formData={formData}
        handleInputChange={handleInputChange}
        disabled={loading}
      />

      <EventCapacityFee
        formData={formData}
        handleInputChange={handleInputChange}
        disabled={loading}
      />

      <Button type="submit" disabled={loading} className="w-full">
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