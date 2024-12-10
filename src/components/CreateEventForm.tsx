import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const CreateEventForm = () => {
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

      // Upload banner photo
      let bannerUrl = "";
      if (bannerFile) {
        const fileExt = bannerFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('event_banners')
          .upload(fileName, bannerFile);

        if (uploadError) throw uploadError;
        bannerUrl = `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/event_banners/${fileName}`;
      }

      // Create event
      const { error: eventError } = await supabase.from('events').insert({
        title: formData.title,
        date: date?.toISOString(),
        location: formData.location,
        category: formData.category,
        participants_limit: parseInt(formData.participantsLimit),
        entrance_fee: formData.isFree === "true" ? null : parseFloat(formData.entranceFee),
        is_free: formData.isFree === "true",
        banner_photo: bannerUrl,
        host_id: user.id,
        description: formData.description,
      });

      if (eventError) throw eventError;

      toast({
        title: "Success",
        description: "Event created successfully",
      });
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
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

      <div>
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label>Date</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          required
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="participantsLimit">Number of Participants</Label>
        <Input
          id="participantsLimit"
          name="participantsLimit"
          type="number"
          min="1"
          value={formData.participantsLimit}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label>Entrance Fee</Label>
        <RadioGroup
          value={formData.isFree}
          onValueChange={(value) => setFormData(prev => ({ ...prev, isFree: value }))}
          className="flex flex-col space-y-2 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="free" />
            <Label htmlFor="free">Free</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="paid" />
            <Label htmlFor="paid">Paid</Label>
          </div>
        </RadioGroup>
        {formData.isFree === "false" && (
          <Input
            type="number"
            name="entranceFee"
            value={formData.entranceFee}
            onChange={handleInputChange}
            placeholder="Enter fee amount"
            min="0"
            step="0.01"
            className="mt-2"
            required
          />
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full min-h-[100px] p-2 border rounded-md"
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating Event..." : "Create Event"}
      </Button>
    </form>
  );
};

export default CreateEventForm;