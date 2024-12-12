import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { uploadImageToSupabase } from "@/utils/uploadUtils";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import EventBasicInfo from "./event-form/EventBasicInfo";
import EventRequirements from "./event-form/EventRequirements";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [requireAdditionalInfo, setRequireAdditionalInfo] = useState(false);
  const [selectedCoachId, setSelectedCoachId] = useState<string>("no_coach"); // Changed initial value
  
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

  // Query to fetch all coaches
  const { data: coaches } = useQuery({
    queryKey: ['coaches'],
    queryFn: async () => {
      const coachesRef = collection(db, 'profiles');
      const q = query(coachesRef, where('role', '==', 'coach'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },
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
      const downloadURL = await uploadImageToSupabase(bannerFile, 'events');

      const eventData = {
        ...formData,
        date: date.toISOString(),
        bannerPhoto: downloadURL,
        hostId: user.uid,
        coachId: selectedCoachId === "no_coach" ? null : selectedCoachId, // Updated this line
        createdAt: new Date().toISOString(),
        currentParticipants: 0,
        requiresAdditionalInfo: requireAdditionalInfo,
      };

      const docRef = await addDoc(collection(db, "events"), eventData);

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
        <Label htmlFor="banner" className="text-white">Banner Photo</Label>
        <Input
          id="banner"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="cursor-pointer bg-white/10 text-white"
          disabled={loading}
        />
      </div>

      <EventBasicInfo
        formData={formData}
        handleInputChange={handleInputChange}
        date={date}
        setDate={setDate}
        disabled={loading}
      />

      <div className="space-y-2">
        <Label htmlFor="coach" className="text-white">Assign Sports Coach (Optional)</Label>
        <Select
          value={selectedCoachId}
          onValueChange={setSelectedCoachId}
          disabled={loading}
        >
          <SelectTrigger className="w-full bg-white/90 text-black border-gray-200">
            <SelectValue placeholder="Select a coach" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 text-black z-50">
            <SelectItem value="no_coach">No coach assigned</SelectItem>
            {coaches?.map((coach: any) => (
              <SelectItem key={coach.id} value={coach.id}>
                {coach.firstName} {coach.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="requireAdditionalInfo"
          checked={requireAdditionalInfo}
          onCheckedChange={(checked) => {
            setRequireAdditionalInfo(checked as boolean);
            setFormData(prev => ({
              ...prev,
              requiresAdditionalInfo: checked as boolean
            }));
          }}
        />
        <Label htmlFor="requireAdditionalInfo" className="text-white">
          Require additional participant information
        </Label>
      </div>

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