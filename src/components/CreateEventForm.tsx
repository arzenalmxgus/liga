import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
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

    try {
      setLoading(true);

      let bannerUrl = "";
      if (bannerFile) {
        const fileExt = bannerFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('event_banners')
          .upload(fileName, bannerFile);

        if (uploadError) throw uploadError;
        bannerUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/event_banners/${fileName}`;
      }

      const { error: eventError } = await supabase.from('events').insert({
        title: formData.title,
        date: date?.toISOString(),
        location: formData.location,
        category: formData.category,
        participants_limit: parseInt(formData.participantsLimit),
        entrance_fee: formData.isFree === "true" ? null : parseFloat(formData.entranceFee),
        is_free: formData.isFree === "true",
        banner_photo: bannerUrl,
        host_id: user.uid,
        description: formData.description,
      });

      if (eventError) throw eventError;

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
        {loading ? "Creating Event..." : "Create Event"}
      </Button>
    </form>
  );
};

export default CreateEventForm;