import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Loader2 } from "lucide-react";
import EventBasicInfo from "./event-form/EventBasicInfo";
import EventDateLocation from "./event-form/EventDateLocation";
import EventCapacityFee from "./event-form/EventCapacityFee";

interface CreateEventFormProps {
  onSuccess?: () => void;
}

const CreateEventForm = ({ onSuccess }: CreateEventFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    category: "",
    participantsLimit: "",
    entranceFee: "",
    isFree: "true",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBannerFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in as a host to create events",
      });
      return;
    }

    if (!bannerFile) {
      toast({
        title: "Image Required",
        description: "Please upload an event banner image",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      toast({
        title: "Date Required",
        description: "Please select an event date",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      console.log("Starting event creation process...");

      // Upload to Firebase Storage
      const storageRef = ref(storage, `event_banners/${Date.now()}_${bannerFile.name}`);
      console.log("Uploading image to Firebase Storage...");
      const uploadResult = await uploadBytes(storageRef, bannerFile);
      console.log("Image uploaded successfully");
      
      // Get the download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);
      console.log("Got download URL:", downloadURL);

      const eventsRef = collection(db, 'events');
      const eventData = {
        title: formData.title,
        date: date.toISOString(),
        location: formData.location,
        category: formData.category,
        participantsLimit: parseInt(formData.participantsLimit),
        entranceFee: formData.isFree === "true" ? null : parseFloat(formData.entranceFee),
        isFree: formData.isFree === "true",
        bannerPhoto: downloadURL,
        hostId: user.uid,
        description: formData.description,
        currentParticipants: 0,
        createdAt: new Date().toISOString(),
      };

      console.log("Creating event with data:", eventData);
      await addDoc(eventsRef, eventData);
      console.log("Event created successfully");

      toast({
        title: "Success",
        description: "Event created successfully",
      });
      
      onSuccess?.();
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
          required
          disabled={loading}
        />
      </div>

      <EventBasicInfo
        title={formData.title}
        description={formData.description}
        category={formData.category}
        onChange={handleInputChange}
      />

      <EventDateLocation
        date={date}
        location={formData.location}
        onDateSelect={setDate}
        onLocationChange={handleInputChange}
      />

      <EventCapacityFee
        participantsLimit={formData.participantsLimit}
        entranceFee={formData.entranceFee}
        isFree={formData.isFree}
        onChange={handleInputChange}
        onFeeTypeChange={(value) => setFormData(prev => ({ ...prev, isFree: value }))}
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating Event...
          </span>
        ) : (
          "Create Event"
        )}
      </Button>
    </form>
  );
};

export default CreateEventForm;