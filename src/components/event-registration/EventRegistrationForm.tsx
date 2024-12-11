import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc, increment } from "firebase/firestore";
import { uploadImageToSupabase } from "@/utils/uploadUtils";
import { Loader2 } from "lucide-react";

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
    
    // Validate all fields are filled
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
      // Upload files to Supabase
      const uploadPromises = [];
      for (const [key, file] of Object.entries(files)) {
        if (file) {
          uploadPromises.push(
            uploadImageToSupabase(file, `registrations/${eventId}`).then(url => [key, url])
          );
        }
      }
      const uploadedFiles = Object.fromEntries(await Promise.all(uploadPromises));

      // Create registration document
      const registrationData = {
        ...formData,
        ...uploadedFiles,
        eventId,
        userId,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="nationality">Nationality</Label>
          <Input
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year">Year Level</Label>
          <Input
            id="year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="course">Course</Label>
          <Input
            id="course"
            name="course"
            value={formData.course}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="academicLoadUnits">Academic Load Units</Label>
          <Input
            id="academicLoadUnits"
            name="academicLoadUnits"
            type="number"
            value={formData.academicLoadUnits}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="yearsOfParticipation">Years of Participation</Label>
          <Input
            id="yearsOfParticipation"
            name="yearsOfParticipation"
            type="number"
            value={formData.yearsOfParticipation}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="highSchoolGradYear">High School Graduation Year</Label>
        <Input
          id="highSchoolGradYear"
          name="highSchoolGradYear"
          type="number"
          value={formData.highSchoolGradYear}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="eventType">Event Type</Label>
          <Select
            value={formData.eventType}
            onValueChange={(value) => setFormData(prev => ({ ...prev, eventType: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="socio-cultural">Socio-cultural</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="school">School</Label>
          <Select
            value={formData.school}
            onValueChange={(value) => setFormData(prev => ({ ...prev, school: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select school" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="school1">School 1</SelectItem>
              <SelectItem value="school2">School 2</SelectItem>
              <SelectItem value="school3">School 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="photo">Photo</Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'photo')}
            required
          />
        </div>
        <div>
          <Label htmlFor="registrarCert">Registrar's Certification</Label>
          <Input
            id="registrarCert"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, 'registrarCert')}
            required
          />
        </div>
        <div>
          <Label htmlFor="psaCopy">PSA Copy</Label>
          <Input
            id="psaCopy"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, 'psaCopy')}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
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