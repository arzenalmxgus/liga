import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInfoProps {
  formData: {
    name: string;
    dateOfBirth: string;
    age: string;
    nationality: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoSection = ({ formData, handleInputChange }: PersonalInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-white font-medium mb-2 block">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="bg-white/10 text-white border-white/20"
            required
          />
        </div>
        <div>
          <Label htmlFor="dateOfBirth" className="text-white font-medium mb-2 block">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="bg-white/10 text-white border-white/20"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age" className="text-white font-medium mb-2 block">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleInputChange}
            className="bg-white/10 text-white border-white/20"
            required
          />
        </div>
        <div>
          <Label htmlFor="nationality" className="text-white font-medium mb-2 block">Nationality</Label>
          <Input
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleInputChange}
            className="bg-white/10 text-white border-white/20"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;