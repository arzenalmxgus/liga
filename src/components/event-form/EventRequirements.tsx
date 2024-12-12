import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventRequirementsProps {
  formData: {
    requiresAdditionalInfo: boolean;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const EventRequirements = ({ formData, handleInputChange, disabled }: EventRequirementsProps) => {
  if (!formData.requiresAdditionalInfo) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Additional Requirements</h3>
      
      <div>
        <Label htmlFor="eventType" className="text-white">Event Type</Label>
        <Select>
          <SelectTrigger className="bg-white text-black border border-gray-300">
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300">
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="socio-cultural">Socio-cultural</SelectItem>
            <SelectItem value="academic">Academic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-white">Required Documents</Label>
        <ul className="list-disc list-inside text-white space-y-2">
          <li>Photo</li>
          <li>Registrar's certification</li>
          <li>PSA copy</li>
        </ul>
      </div>

      <div>
        <Label className="text-white">Required Information</Label>
        <ul className="list-disc list-inside text-white space-y-2">
          <li>Name</li>
          <li>Date of Birth</li>
          <li>Age</li>
          <li>Nationality</li>
          <li>Year</li>
          <li>Course</li>
        </ul>
      </div>

      <div>
        <Label className="text-white">Optional Information</Label>
        <ul className="list-disc list-inside text-white space-y-2">
          <li>Academic Load Units</li>
          <li>Years of Participation</li>
          <li>Year of High School Graduation (for students)</li>
        </ul>
      </div>
    </div>
  );
};

export default EventRequirements;